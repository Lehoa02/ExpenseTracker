import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment-timezone';
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
import { filterIncomeByPeriod, getUserTimeZone } from '../../utils/helper';
import IncomeSourceChart from '../../components/Income/IncomeSourceChart';


const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [scheduledIncomeData, setScheduledIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openDeleteSourceAlert, setOpenDeleteSourceAlert] = useState({
    show: false,
    source: null,
  });
  const [openEditSourceChoice, setOpenEditSourceChoice] = useState({
    show: false,
    data: null,
  });
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState({
    show: false,
    data: null,
    scope: 'single',
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [incomeFilter, setIncomeFilter] = useState(null);
  const [incomeOverviewGroupBy, setIncomeOverviewGroupBy] = useState('30days');
  const [sourceFilter, setSourceFilter] = useState(null);
  const [openBulkDeleteAlert, setOpenBulkDeleteAlert] = useState({
    show: false,
    items: [],
  });

  const overviewFilteredIncomeData = useMemo(() => {
    let data = incomeData;
    const timeZone = getUserTimeZone();

    if (incomeOverviewGroupBy === '30days' || incomeOverviewGroupBy === 'month') {
      const rangeEnd = moment.tz(timeZone).endOf('day');
      const rangeStart = incomeOverviewGroupBy === '30days'
        ? rangeEnd.clone().subtract(29, 'days').startOf('day')
        : rangeEnd.clone().subtract(5, 'months').startOf('month');
      const rangeUnit = incomeOverviewGroupBy === '30days' ? 'day' : 'month';

      data = data.filter((item) => {
        if (!item?.date) return false;

        return moment.tz(item.date, item.timezone || timeZone).isBetween(rangeStart, rangeEnd, rangeUnit, '[]');
      });
    }

    return data;
  }, [incomeData, incomeOverviewGroupBy]);

  const periodFilteredIncomeData = useMemo(() => {
    let data = overviewFilteredIncomeData;

    if (incomeFilter) {
      data = filterIncomeByPeriod(data, incomeFilter.groupBy, incomeFilter.bucketKey);
    }

    return data;
  }, [overviewFilteredIncomeData, incomeFilter]);

  const incomeSourceChartData = useMemo(() => {
    let data = overviewFilteredIncomeData;

    if (incomeFilter) {
      data = filterIncomeByPeriod(data, incomeFilter.groupBy, incomeFilter.bucketKey);
    }

    return data;
  }, [overviewFilteredIncomeData, incomeFilter]);

  const filteredIncomeData = useMemo(() => {
    let data = periodFilteredIncomeData;

    if (sourceFilter) {
      data = data.filter((item) => item?.source?.trim() === sourceFilter);
    }

    return data;
  }, [periodFilteredIncomeData, sourceFilter]);

  const recentIncomeTransactions = useMemo(
    () =>
      [...incomeData]
        .filter((item) => item?.source)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [incomeData]
  );

  //Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;
    
    setLoading(true);

    try{
      const [incomeResponse, scheduledResponse] = await Promise.all([
        axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`),
        axiosInstance.get(`${API_PATHS.INCOME.GET_SCHEDULED_INCOME}`),
      ]);

      if(incomeResponse.data) {
        setIncomeData(incomeResponse.data);
      }
      if(scheduledResponse.data) {
        setScheduledIncomeData(scheduledResponse.data);
      }
    } catch (error) {
      console.log('Error fetching income details:', error);
    } finally {
      setLoading(false);

    }
  };

  //Handle Add Income
  const handleAddIncome = async (income) => {
    const { amount, source, date, icon, isRecurring, frequency } = income;  

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
      const timeZone = getUserTimeZone();
      const response = await axiosInstance.post(`${API_PATHS.INCOME.ADD_INCOME}`, {
        amount,
        source,
        date,
        icon,
        isRecurring,
        frequency,
        timezone: timeZone,
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

  const handleStopRecurringIncome = async (templateId) => {
    try {
      await axiosInstance.patch(API_PATHS.INCOME.STOP_RECURRING(templateId));
      toast.success('Recurring income sequence stopped');
      fetchIncomeDetails();
    } catch (error) {
      console.log("Error stopping recurring income:", error.response?.data?.message || error.message);
      toast.error('Unable to stop recurring income sequence');
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

  const handleIncomeGroupByChange = (groupBy) => {
    setIncomeOverviewGroupBy(groupBy);
    clearIncomeFilter();
    clearSourceFilter();
  };

  const handleSourceSelect = (source) => {
    setSourceFilter((currentSource) => (currentSource === source ? null : source));
  };

  const handleEditIncomeRequest = (income) => {
    if (income?.recurringTemplateId && income?.recurrenceStatus !== 'stopped') {
      setOpenEditSourceChoice({ show: true, data: income });
      return;
    }

    setOpenEditIncomeModal({ show: true, data: income, scope: 'single' });
  };

  const handleOpenIncomeEdit = (scope) => {
    if (!openEditSourceChoice.data) {
      return;
    }

    setOpenEditSourceChoice({ show: false, data: null });
    setOpenEditIncomeModal({ show: true, data: openEditSourceChoice.data, scope });
  };

  const handleSaveIncomeEdit = async (income) => {
    if (!openEditIncomeModal.data?._id) {
      return;
    }

    const { scope, data } = openEditIncomeModal;

    try {
      const timeZone = getUserTimeZone();

      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(data._id), {
        amount: income.amount,
        source: income.source,
        date: income.date,
        icon: income.icon,
        isRecurring: income.isRecurring,
        frequency: income.frequency,
        timezone: timeZone,
        scope,
        templateId: data.recurringTemplateId,
      });

      setOpenEditIncomeModal({ show: false, data: null, scope: 'single' });
      toast.success(scope === 'sequence' ? 'Income sequence updated successfully' : 'Income updated successfully');
      fetchIncomeDetails();
    } catch (error) {
      console.log('Error updating income:', error.response?.data?.message || error.message);
      toast.error('Unable to update income');
    }
  };

  const handleDeleteIncomeSourceRequest = (source) => {
    setOpenDeleteSourceAlert({ show: true, source });
  };

  const confirmDeleteIncomeSource = async () => {
    if (!openDeleteSourceAlert.source) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME_BY_SOURCE(openDeleteSourceAlert.source));

      toast.success('Income source deleted successfully');
      setIncomeFilter(null);
      setSourceFilter((currentSource) => (currentSource === openDeleteSourceAlert.source ? null : currentSource));
      setOpenDeleteSourceAlert({ show: false, source: null });
      fetchIncomeDetails();
    } catch (error) {
      console.log('Error deleting income source:', error.response?.data?.message || error.message);
      toast.error('Unable to delete income source');
    }
  };

  const handleDeleteIncomeRequest = (income) => {
    setOpenDeleteAlert({ show: true, data: income });
  };

  const confirmDeleteIncome = async () => {
    if (!openDeleteAlert.data?._id) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(openDeleteAlert.data._id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Income deleted successfully');
      fetchIncomeDetails();
    } catch (error) {
      console.log('Error deleting income:', error.response?.data?.message || error.message);
      toast.error('Unable to delete income');
    }
  };

  const handleStopRecurringIncomeRequest = async () => {
    if (!openDeleteAlert.data?.recurringTemplateId) {
      return;
    }

    await handleStopRecurringIncome(openDeleteAlert.data.recurringTemplateId);
    setOpenDeleteAlert({ show: false, data: null });
  };

  const handleBulkDeleteIncomeRequest = (items = []) => {
    setOpenBulkDeleteAlert({ show: true, items });
  };

  const confirmBulkDeleteIncome = async (stopSequences = false) => {
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
          recurringTemplateIds.map((templateId) => axiosInstance.patch(API_PATHS.INCOME.STOP_RECURRING(templateId)))
        );
      }

      await Promise.all(items.map((item) => axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(item._id))));
      toast.success(stopSequences ? 'Selected income items deleted and sequences stopped' : 'Selected income items deleted successfully');
      setOpenBulkDeleteAlert({ show: false, items: [] });
      fetchIncomeDetails();
    } catch (error) {
      console.log('Error deleting income items:', error.response?.data?.message || error.message);
      toast.error('Unable to delete selected income items');
    }
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
            onGroupByChange={handleIncomeGroupByChange}
            incomeFilter={incomeFilter}
            onClearFilter={clearIncomeFilter}
            />
          
            <IncomeSourceChart
              transactions={incomeSourceChartData}
              selectedSource={sourceFilter}
              onSourceSelect={handleSourceSelect}
              onClearSource={clearSourceFilter}
              onDeleteSource={handleDeleteIncomeSourceRequest}
            />
          </div>

          <IncomeList 
            transactions={[
              ...scheduledIncomeData.map(item => ({...item, isScheduled: true})),
              ...filteredIncomeData
            ]}
            onDelete={handleDeleteIncomeRequest}
            onEdit={handleEditIncomeRequest}
            onBulkDeleteRequest={handleBulkDeleteIncomeRequest}
            onDownload={handleDownloadIncomeDetails}
            filterLabel={incomeFilter?.label}
            sourceLabel={sourceFilter}
            onClearFilters={clearAllFilters}
            onStopRecurring={handleStopRecurringIncome}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
          >
            <AddIncomeForm 
            onAddIncome={handleAddIncome}
            recentTransactions={recentIncomeTransactions}
            />
          </Modal>

          <Modal
            isOpen={openEditSourceChoice.show}
            onClose={() => setOpenEditSourceChoice({ show: false, data: null })}
            title="Edit Recurring Income"
          >
            <DeleteAlert
              content="This income belongs to a recurring sequence. Do you want to update only this item or the whole sequence?"
              primaryLabel="Only this item"
              secondaryLabel="Whole sequence"
              secondaryButtonLabel="Whole sequence"
              onDelete={() => handleOpenIncomeEdit('single')}
              onSecondaryAction={() => handleOpenIncomeEdit('sequence')}
            />
          </Modal>

          <Modal
            isOpen={openEditIncomeModal.show}
            onClose={() => setOpenEditIncomeModal({ show: false, data: null, scope: 'single' })}
            title={openEditIncomeModal.scope === 'sequence' ? 'Edit Income Sequence' : 'Edit Income'}
          >
            <AddIncomeForm
              initialValues={openEditIncomeModal.data}
              submitLabel={openEditIncomeModal.scope === 'sequence' ? 'Update sequence' : 'Update income'}
              onSubmit={handleSaveIncomeEdit}
              recentTransactions={recentIncomeTransactions}
            />
          </Modal>

          <Modal 
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title={openDeleteAlert.data?.recurringTemplateId && openDeleteAlert.data?.recurrenceStatus !== 'stopped' ? 'Recurring Income' : 'Delete Income'}
          >
            <DeleteAlert 
              content={
                openDeleteAlert.data?.recurringTemplateId && openDeleteAlert.data?.recurrenceStatus !== 'stopped'
                  ? 'This income is part of a recurring sequence. Do you want to delete only this item or stop the whole sequence?'
                  : 'Are you sure you want to delete this income?'
              }
              primaryLabel="Delete item"
              secondaryLabel={openDeleteAlert.data?.recurringTemplateId && openDeleteAlert.data?.recurrenceStatus !== 'stopped' ? 'Stop sequence' : undefined}
              onDelete={confirmDeleteIncome}
              onSecondaryAction={handleStopRecurringIncomeRequest}
            />
          </Modal>

          <Modal
            isOpen={openDeleteSourceAlert.show}
            onClose={() => setOpenDeleteSourceAlert({ show: false, source: null })}
            title="Delete Income Source"
          >
            <DeleteAlert
              content={`Are you sure you want to delete all income entries for ${openDeleteSourceAlert.source || 'this source'}?`}
              primaryLabel="Delete source"
              onDelete={confirmDeleteIncomeSource}
            />
          </Modal>

          <Modal
            isOpen={openBulkDeleteAlert.show}
            onClose={() => setOpenBulkDeleteAlert({ show: false, items: [] })}
            title="Delete Selected Income Items"
          >
            <DeleteAlert
              content={
                openBulkDeleteAlert.items.some((item) => item?.recurringTemplateId && item?.recurrenceStatus !== 'stopped')
                  ? 'Some selected income items are part of recurring sequences. Do you want to delete only the selected items or stop the sequence(s) too?'
                  : `Are you sure you want to delete ${openBulkDeleteAlert.items.length} selected income item(s)?`
              }
              primaryLabel="Delete items"
              secondaryLabel={
                openBulkDeleteAlert.items.some((item) => item?.recurringTemplateId && item?.recurrenceStatus !== 'stopped')
                  ? 'Stop sequence(s)'
                  : undefined
              }
              onDelete={() => confirmBulkDeleteIncome(false)}
              onSecondaryAction={() => confirmBulkDeleteIncome(true)}
            />
          </Modal>
        </div>

</DashboardLayout> 
 )
}

export default Income