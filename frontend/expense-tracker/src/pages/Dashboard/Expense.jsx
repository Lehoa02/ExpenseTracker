import React, { useState, useEffect, useMemo } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { toast } from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Model from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';
import { filterExpensesByPeriod } from '../../utils/helper';


const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [expenseFilter, setExpenseFilter] = useState(null);

    const filteredExpenseData = useMemo(() => {
      if (!expenseFilter) {
        return expenseData;
      }

      return filterExpensesByPeriod(expenseData, expenseFilter.groupBy, expenseFilter.bucketKey);
    }, [expenseData, expenseFilter]);

    //Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;
    
    setLoading(true);

    try{
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);

      if(response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log('Error fetching expense details:', error);
    } finally {
      setLoading(false);

    }
  };

  //Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { amount, category, date, icon } = expense;  

    //Validation check
    if(!category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!amount || isNaN(amount)) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }
    
    try {
      const response = await axiosInstance.post(`${API_PATHS.EXPENSE.ADD_EXPENSE}`, {
        amount,
        category,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.log("Error adding expense:", error.response?.data?.message || error.message);
    }
  };

  //Delete Expense
  const handleDeleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.log("Error deleting expense:", error.response?.data?.message || error.message);
    }
  };

  const handleChartPointClick = (bucket) => {
    if (!bucket?.bucketKey || !bucket?.groupBy) {
      return;
    }

    setExpenseFilter({
      bucketKey: bucket.bucketKey,
      groupBy: bucket.groupBy,
      label: bucket.month,
    });
  };

  const clearExpenseFilter = () => {
    setExpenseFilter(null);
  };

  //handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob',
      });

      //Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };


  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);
  
  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
              <ExpenseOverview
                transactions={expenseData}
                onAddExpense={() => setOpenAddExpenseModal(true)}
                onPointClick={handleChartPointClick}
                onGroupByChange={clearExpenseFilter}
              />
          </div>
          <ExpenseList 
            transactions={filteredExpenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
            filterLabel={expenseFilter?.label}
            onClearFilter={clearExpenseFilter}
          />
        </div>
        <Model
        isOpen={openAddExpenseModal}
        onClose={() => setOpenAddExpenseModal(false)}
        title="Add Expense"
      >
        <AddExpenseForm onAddExpense={handleAddExpense} />
      </Model>

      <Model 
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
          >
            <DeleteAlert 
            content = "Are you sure you want to delete this expense?"
            onDelete={() => handleDeleteExpense(openDeleteAlert.data)}
             />
          </Model>
      </div>
      </DashboardLayout>
  );
}

export default Expense