import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useUserAuth } from '../../hooks/useUserAuth';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import { toast } from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { filterIncomeByPeriod } from '../../utils/helper';
import IncomeSourceChart from '../../components/Income/IncomeSourceChart';


const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [incomeFilter, setIncomeFilter] = useState(null);
  const [sourceFilter, setSourceFilter] = useState(null);

  const periodFilteredIncomeData = useMemo(() => {
    let data = incomeData;

    if (incomeFilter) {
      data = filterIncomeByPeriod(data, incomeFilter.groupBy, incomeFilter.bucketKey);
    }

    return data;
  }, [incomeData, incomeFilter]);

  const filteredIncomeData = useMemo(() => {
    let data = periodFilteredIncomeData;

    if (sourceFilter) {
      data = data.filter((item) => item?.source?.trim() === sourceFilter);
    }

    return data;
  }, [periodFilteredIncomeData, sourceFilter]);

  //Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;
    
    setLoading(true);

    try{
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);

      if(response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log('Error fetching income details:', error);
    } finally {
      setLoading(false);

    }
  };

  //Handle Add Income
  const handleAddIncome = async (income) => {
    const { amount, source, date, icon } = income;  

    //Validation check
    if(!source.trim()) {
      toast.error("Source is required");
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
      const response = await axiosInstance.post(`${API_PATHS.INCOME.ADD_INCOME}`, {
        amount,
        source,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.log("Error adding income:", error.response?.data?.message || error.message);
    }
  };

  //Delete Income
  const handleDeleteIncome = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.log("Error deleting income:", error.response?.data?.message || error.message);
    }
  };

   const handleChartPointClick = (bucket) => {
    if (!bucket?.bucketKey || !bucket?.groupBy) {
      return;
    }

    setIncomeFilter({
      bucketKey: bucket.bucketKey,
      groupBy: bucket.groupBy,
      label: bucket.month,
    });
  };

  const clearIncomeFilter = () => {
    setIncomeFilter(null);
  };

  const handleSourceSelect = (source) => {
    setSourceFilter((currentSource) => (currentSource === source ? null : source));
  };

  const clearSourceFilter = () => {
    setSourceFilter(null);
  };

  const clearAllFilters = () => {
    clearIncomeFilter();
    clearSourceFilter();
  };

  //handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob',
      });

      //Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
            onPointClick={handleChartPointClick}
            onGroupByChange={clearIncomeFilter}
            incomeFilter={incomeFilter}
            onClearFilter={clearIncomeFilter}
            />
          
            <IncomeSourceChart
              transactions={periodFilteredIncomeData}
              selectedSource={sourceFilter}
              onSourceSelect={handleSourceSelect}
              onClearSource={clearSourceFilter}
            />
          </div>

          <IncomeList 
            transactions={filteredIncomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
            filterLabel={incomeFilter?.label}
            sourceLabel={sourceFilter}
            onClearFilters={clearAllFilters}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
          >
            <AddIncomeForm 
            onAddIncome={handleAddIncome} 
            />
          </Modal>

          <Modal 
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
          >
            <DeleteAlert 
            content = "Are you sure you want to delete this income?"
            onDelete={() => handleDeleteIncome(openDeleteAlert.data)}
             />
          </Modal>
        </div>

</DashboardLayout> 
 )
}

export default Income