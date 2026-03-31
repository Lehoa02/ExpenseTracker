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
import { filterExpensesByOverviewGroup, filterExpensesByPeriod } from '../../utils/helper';
import { getUserTimeZone } from '../../utils/helper';
import ExpenseCategoryChart from '../../components/Expense/ExpenseCategoryChart';


const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
      const [openDeleteCategoryAlert, setOpenDeleteCategoryAlert] = useState({
        show: false,
        category: null,
      });
    const [openEditCategoryChoice, setOpenEditCategoryChoice] = useState({
      show: false,
      data: null,
    });
    const [openEditExpenseModal, setOpenEditExpenseModal] = useState({
      show: false,
      data: null,
      scope: 'single',
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [expenseFilter, setExpenseFilter] = useState(null);
    const [expenseOverviewGroupBy, setExpenseOverviewGroupBy] = useState('7days');
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [openBulkDeleteAlert, setOpenBulkDeleteAlert] = useState({
      show: false,
      items: [],
    });

    const recentExpenseTransactions = useMemo(
      () =>
        Array.from(
          [...expenseData]
          .filter((item) => item?.category)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .reduce((templates, item) => {
            const categoryKey = item.category.trim().toLowerCase();

            if (!templates.has(categoryKey)) {
              templates.set(categoryKey, item);
            }

            return templates;
          }, new Map())
          .values()
        ),
      [expenseData]
    );

    const overviewFilteredExpenseData = useMemo(
      () => filterExpensesByOverviewGroup(expenseData, expenseOverviewGroupBy),
      [expenseData, expenseOverviewGroupBy]
    );

    const periodFilteredExpenseData = useMemo(() => {
      let data = overviewFilteredExpenseData;

      if (expenseFilter) {
        data = filterExpensesByPeriod(data, expenseFilter.groupBy, expenseFilter.bucketKey);
      }

      return data;
    }, [overviewFilteredExpenseData, expenseFilter]);

    const filteredExpenseData = useMemo(() => {
      let data = periodFilteredExpenseData;

      if (categoryFilter) {
        data = data.filter((item) => item?.category?.trim() === categoryFilter);
      }

      return data;
    }, [periodFilteredExpenseData, categoryFilter]);

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
    const { amount, category, date, icon, isRecurring, frequency } = expense;  

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
      const timeZone = getUserTimeZone();
      const response = await axiosInstance.post(`${API_PATHS.EXPENSE.ADD_EXPENSE}`, {
        amount,
        category,
        date,
        icon,
        isRecurring,
        frequency,
        timezone: timeZone,
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

  const handleStopRecurringExpense = async (templateId) => {
    try {
      await axiosInstance.patch(API_PATHS.EXPENSE.STOP_RECURRING(templateId));
      toast.success('Recurring expense sequence stopped');
      fetchExpenseDetails();
    } catch (error) {
      console.log("Error stopping recurring expense:", error.response?.data?.message || error.message);
      toast.error('Unable to stop recurring expense sequence');
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

    const handleExpenseGroupByChange = (groupBy) => {
      setExpenseOverviewGroupBy(groupBy);
      clearExpenseFilter();
      clearCategoryFilter();
    };

  const handleCategorySelect = (category) => {
    setCategoryFilter((currentCategory) => (currentCategory === category ? null : category));
  };

  const handleEditExpenseRequest = (expense) => {
    if (expense?.recurringTemplateId && expense?.recurrenceStatus !== 'stopped') {
      setOpenEditCategoryChoice({ show: true, data: expense });
      return;
    }

    setOpenEditExpenseModal({ show: true, data: expense, scope: 'single' });
  };

  const handleOpenExpenseEdit = (scope) => {
    if (!openEditCategoryChoice.data) {
      return;
    }

    setOpenEditCategoryChoice({ show: false, data: null });
    setOpenEditExpenseModal({ show: true, data: openEditCategoryChoice.data, scope });
  };

  const handleSaveExpenseEdit = async (expense) => {
    if (!openEditExpenseModal.data?._id) {
      return;
    }

    const { scope, data } = openEditExpenseModal;

    try {
      const timeZone = getUserTimeZone();

      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(data._id), {
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        icon: expense.icon,
        isRecurring: expense.isRecurring,
        frequency: expense.frequency,
        timezone: timeZone,
        scope,
        templateId: data.recurringTemplateId,
      });

      setOpenEditExpenseModal({ show: false, data: null, scope: 'single' });
      toast.success(scope === 'sequence' ? 'Expense sequence updated successfully' : 'Expense updated successfully');
      fetchExpenseDetails();
    } catch (error) {
      console.log('Error updating expense:', error.response?.data?.message || error.message);
      toast.error('Unable to update expense');
    }
  };

  const handleDeleteExpenseCategoryRequest = (category) => {
    setOpenDeleteCategoryAlert({ show: true, category });
  };

  const confirmDeleteExpenseCategory = async () => {
    if (!openDeleteCategoryAlert.category) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE_BY_CATEGORY(openDeleteCategoryAlert.category));

      toast.success('Expense category deleted successfully');
      setExpenseFilter(null);
      setCategoryFilter((currentCategory) => (currentCategory === openDeleteCategoryAlert.category ? null : currentCategory));
      setOpenDeleteCategoryAlert({ show: false, category: null });
      fetchExpenseDetails();
    } catch (error) {
      console.log('Error deleting expense category:', error.response?.data?.message || error.message);
      toast.error('Unable to delete expense category');
    }
  };

  const handleDeleteExpenseRequest = (expense) => {
    setOpenDeleteAlert({ show: true, data: expense });
  };

  const confirmDeleteExpense = async () => {
    if (!openDeleteAlert.data?._id) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(openDeleteAlert.data._id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Expense deleted successfully');
      fetchExpenseDetails();
    } catch (error) {
      console.log('Error deleting expense:', error.response?.data?.message || error.message);
      toast.error('Unable to delete expense');
    }
  };

  const handleStopRecurringExpenseRequest = async () => {
    if (!openDeleteAlert.data?.recurringTemplateId) {
      return;
    }

    await handleStopRecurringExpense(openDeleteAlert.data.recurringTemplateId);
    setOpenDeleteAlert({ show: false, data: null });
  };

  const handleBulkDeleteExpenseRequest = (items = []) => {
    setOpenBulkDeleteAlert({ show: true, items });
  };

  const confirmBulkDeleteExpense = async (stopSequences = false) => {
    const items = openBulkDeleteAlert.items || [];

    if (!items.length) {
      return;
    }

    try {
      if (stopSequences) {
        const recurringTemplateIds = [
          ...new Set(
            items
              .filter((item) => item?.recurringTemplateId && item?.recurrenceStatus !== 'stopped')
              .map((item) => item.recurringTemplateId)
          ),
        ];

        await Promise.all(
          recurringTemplateIds.map((templateId) => axiosInstance.patch(API_PATHS.EXPENSE.STOP_RECURRING(templateId)))
        );
      }

      await Promise.all(items.map((item) => axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(item._id))));
      toast.success(stopSequences ? 'Selected expense items deleted and sequences stopped' : 'Selected expense items deleted successfully');
      setOpenBulkDeleteAlert({ show: false, items: [] });
      fetchExpenseDetails();
    } catch (error) {
      console.log('Error deleting expense items:', error.response?.data?.message || error.message);
      toast.error('Unable to delete selected expense items');
    }
  };

  const clearCategoryFilter = () => {
    setCategoryFilter(null);
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <ExpenseOverview
                transactions={expenseData}
                onAddExpense={() => setOpenAddExpenseModal(true)}
                onPointClick={handleChartPointClick}
                onGroupByChange={handleExpenseGroupByChange}
                expenseFilter={expenseFilter}
                onClearFilter={clearExpenseFilter}
              />
              <ExpenseCategoryChart
                transactions={periodFilteredExpenseData}
                selectedCategory={categoryFilter}
                onCategorySelect={handleCategorySelect}
                onClearCategory={clearCategoryFilter}
                onDeleteCategory={handleDeleteExpenseCategoryRequest}
              />
          </div>
          <ExpenseList 
            transactions={filteredExpenseData}
            onDelete={handleDeleteExpenseRequest}
            onEdit={handleEditExpenseRequest}
            onBulkDeleteRequest={handleBulkDeleteExpenseRequest}
            onDownload={handleDownloadExpenseDetails}
            filterLabel={expenseFilter?.label}
            categoryLabel={categoryFilter}
            onClearFilter={clearExpenseFilter}
            onClearCategoryFilter={clearCategoryFilter}
            onStopRecurring={handleStopRecurringExpense}
          />
        </div>
        <Model
        isOpen={openAddExpenseModal}
        onClose={() => setOpenAddExpenseModal(false)}
        title="Add Expense"
      >
            <AddExpenseForm onAddExpense={handleAddExpense} recentTransactions={recentExpenseTransactions.slice(0, 5)} />
      </Model>

          <Model
            isOpen={openEditCategoryChoice.show}
            onClose={() => setOpenEditCategoryChoice({ show: false, data: null })}
            title="Edit Recurring Expense"
          >
            <DeleteAlert
              content="This expense belongs to a recurring sequence. Do you want to update only this item or the whole sequence?"
              primaryLabel="Only this item"
              secondaryLabel="Whole sequence"
              secondaryButtonLabel="Whole sequence"
              onDelete={() => handleOpenExpenseEdit('single')}
              onSecondaryAction={() => handleOpenExpenseEdit('sequence')}
            />
          </Model>

          <Model
            isOpen={openEditExpenseModal.show}
            onClose={() => setOpenEditExpenseModal({ show: false, data: null, scope: 'single' })}
            title={openEditExpenseModal.scope === 'sequence' ? 'Edit Expense Sequence' : 'Edit Expense'}
          >
            <AddExpenseForm
              initialValues={openEditExpenseModal.data}
              submitLabel={openEditExpenseModal.scope === 'sequence' ? 'Update sequence' : 'Update expense'}
              onSubmit={handleSaveExpenseEdit}
              recentTransactions={recentExpenseTransactions.slice(0, 5)}
            />
          </Model>

          <Model
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title={openDeleteAlert.data?.recurringTemplateId && openDeleteAlert.data?.recurrenceStatus !== 'stopped' ? 'Recurring Expense' : 'Delete Expense'}
          >
            <DeleteAlert
              content={
                openDeleteAlert.data?.recurringTemplateId && openDeleteAlert.data?.recurrenceStatus !== 'stopped'
                  ? 'This expense is part of a recurring sequence. Do you want to delete only this item or stop the whole sequence?'
                  : 'Are you sure you want to delete this expense?'
              }
              primaryLabel="Delete item"
              secondaryLabel={openDeleteAlert.data?.recurringTemplateId && openDeleteAlert.data?.recurrenceStatus !== 'stopped' ? 'Stop sequence' : undefined}
              onDelete={confirmDeleteExpense}
              onSecondaryAction={handleStopRecurringExpenseRequest}
            />
          </Model>

          <Model
            isOpen={openDeleteCategoryAlert.show}
            onClose={() => setOpenDeleteCategoryAlert({ show: false, category: null })}
            title="Delete Expense Category"
          >
            <DeleteAlert
              content={`Are you sure you want to delete all expense entries for ${openDeleteCategoryAlert.category || 'this category'}?`}
              primaryLabel="Delete category"
              onDelete={confirmDeleteExpenseCategory}
            />
          </Model>

          <Model
            isOpen={openBulkDeleteAlert.show}
            onClose={() => setOpenBulkDeleteAlert({ show: false, items: [] })}
            title="Delete Selected Expense Items"
          >
            <DeleteAlert
              content={
                openBulkDeleteAlert.items.some((item) => item?.recurringTemplateId && item?.recurrenceStatus !== 'stopped')
                  ? 'Some selected expense items are part of recurring sequences. Do you want to delete only the selected items or stop the sequence(s) too?'
                  : `Are you sure you want to delete ${openBulkDeleteAlert.items.length} selected expense item(s)?`
              }
              primaryLabel="Delete items"
              secondaryLabel={
                openBulkDeleteAlert.items.some((item) => item?.recurringTemplateId && item?.recurrenceStatus !== 'stopped')
                  ? 'Stop sequence(s)'
                  : undefined
              }
              onDelete={() => confirmBulkDeleteExpense(false)}
              onSecondaryAction={() => confirmBulkDeleteExpense(true)}
            />
          </Model>
      </div>
      </DashboardLayout>
  );
}

export default Expense