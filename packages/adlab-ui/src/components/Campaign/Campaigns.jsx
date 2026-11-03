import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Add24Regular, Copy24Regular, Delete24Regular, Edit24Regular, Search24Regular } from '@tfs/icons';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Input,
  makeStyles,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from '@tfs/ui-components-next';

import { useGetCampaignsQuery } from '../../features/api/campaignApi';
import i18n from '../../helpers/i18n';
import { STATUS_COLORS } from '../../lib/constants';
import { populateCampaignForm, resetCampaignForm } from '../../store/slices/campaignSlice';

import './Campaigns.scss';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingVerticalL,
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalL,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F6F7FA',
    padding: tokens.spacingHorizontalM,
    borderRadius: 8,
    height: '70px',
    boxShadow: '6px 6px 54px 0px #0000000D',
    marginBottom: tokens.spacingVerticalM,
  },
  tableContainer: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    height: '60vh',
    overflowY: 'auto',
    boxShadow: '6px 6px 54px 0px #0000000D',
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  actionButton: {
    minWidth: 0,
    padding: 0,
  },
  actionGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground2,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  paginationInfo: {
    color: tokens.colorNeutralForeground2,
  },
  paginationControls: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
});

const Campaigns = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Debounce search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { 
    data: campaignsData, 
    isLoading, 
    error,
    refetch
  } = useGetCampaignsQuery({
    page: currentPage,
    pageSize,
    search: debouncedSearchQuery || undefined,
  });

  const campaigns = campaignsData?.campaigns || [];
  const pagination = campaignsData?.pagination || {};

  // Define table columns
  const CAMPAIGN_TABLE_COLUMNS = [
    { key: 'name', label: i18n.t(i18n.keys.campaign_name_column), minWidth: '200px' },
    { key: 'type', label: i18n.t(i18n.keys.type_column), minWidth: '120px' },
    { key: 'status', label: i18n.t(i18n.keys.status_column), minWidth: '100px' },
    { key: 'objective', label: i18n.t(i18n.keys.objective_column), minWidth: '120px' },
    { key: 'budget', label: i18n.t(i18n.keys.budget_column), minWidth: '120px' },
    { key: 'startDate', label: i18n.t(i18n.keys.start_date_column), minWidth: '120px' },
    { key: 'endDate', label: i18n.t(i18n.keys.end_date_column), minWidth: '120px' },
    { key: 'actions', label: i18n.t(i18n.keys.actions_column), minWidth: '120px' },
  ];

  const handleCreateCampaign = () => {
    // Reset form for new campaign
    dispatch(resetCampaignForm());
    navigate('/adlab/campaign/basic');
  };

  const handleEditCampaign = (campaign) => {
    // Populate the store with campaign data
    dispatch(populateCampaignForm(campaign));
    // Navigate to basic details (campaignId will be in store)
    navigate('/adlab/campaign/basic');
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore || currentPage < Math.ceil(pagination.total / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatBudget = (budget) => {
    if (!budget) return '-';
    const amount = Number(budget.amount);
    return `${budget.currency} ${amount.toLocaleString()}/${budget.budgetType.toLowerCase()}`;
  };

  return (
    <div className="campaign-bg">
      <div className={styles.root}>
      <div className={styles.header}>
        <Breadcrumb aria-label="Breadcrumb navigation">
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab">Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton href="/adlab/campaigns" current>
              Campaigns
            </BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className={styles.searchContainer}>
        <Input
          contentBefore={<Search24Regular />}
          placeholder={i18n.t(i18n.keys.search_campaigns)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button icon={<Add24Regular />} appearance="primary" onClick={handleCreateCampaign}>
          {i18n.t(i18n.keys.create_campaign)}
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <Table style={{ maxHeight: "510px" }}>
          <TableHeader>
            <TableRow>
              {CAMPAIGN_TABLE_COLUMNS.map((column) => (
                <TableHeaderCell
                  key={column.key}
                  style={{ minWidth: column.minWidth }}
                  className={styles.stickyHeader}
                >
                  {column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={CAMPAIGN_TABLE_COLUMNS.length}>
                  <div className={styles.loadingContainer}>
                    <Spinner size="medium" />
                    <Text>{i18n.t(i18n.keys.loading)}</Text>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={CAMPAIGN_TABLE_COLUMNS.length}>
                  <div className={styles.emptyState}>
                    <Text size={400} style={{ color: tokens.colorPaletteRedForeground1 }}>
                      {i18n.t(i18n.keys.error_loading_campaigns)}
                    </Text>
                    <Text size={300}>{i18n.t(i18n.keys.please_try_again_later)}</Text>
                    <Button appearance="secondary" onClick={() => refetch()}>
                      {i18n.t(i18n.keys.retry)}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <TableRow key={campaign._id}>
                  <TableCell>{campaign.campaignName}</TableCell>
                  <TableCell>{campaign.campaignType}</TableCell>
                  <TableCell>
                    <Button appearance={STATUS_COLORS[campaign.status] || 'secondary'} size="small">
                      {campaign.status}
                    </Button>
                  </TableCell>
                  <TableCell>{campaign.objective}</TableCell>
                  <TableCell>{formatBudget(campaign.budget)}</TableCell>
                  <TableCell>{formatDate(campaign.startDate)}</TableCell>
                  <TableCell>{formatDate(campaign.endDate)}</TableCell>
                  <TableCell>
                    <div className={styles.actionGroup}>
                      <Button
                        icon={<Edit24Regular />}
                        appearance="subtle"
                        className={styles.actionButton}
                        onClick={() => handleEditCampaign(campaign)}
                      />
                      <Button icon={<Copy24Regular />} appearance="subtle" className={styles.actionButton} />
                      <Button icon={<Delete24Regular />} appearance="subtle" className={styles.actionButton} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={CAMPAIGN_TABLE_COLUMNS.length}>
                  <div className={styles.emptyState}>
                    <Text size={400}>{i18n.t(i18n.keys.no_campaigns_found)}</Text>
                    <Text size={300}>
                      {debouncedSearchQuery 
                        ? i18n.t(i18n.keys.try_adjusting_search)
                        : i18n.t(i18n.keys.create_first_campaign)
                      }
                    </Text>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
        
      {/* Pagination - Always visible */}
      <div className={styles.pagination}>
        <Text className={styles.paginationInfo} size={300}>
          {isLoading ? (
            i18n.t(i18n.keys.loading)
          ) : error ? (
            i18n.t(i18n.keys.error_loading_data)
          ) : pagination.total > 0 ? (
            i18n.t(i18n.keys.showing_pagination, {
              from: ((currentPage - 1) * pageSize) + 1,
              to: Math.min(currentPage * pageSize, pagination.total),
              total: pagination.total
            })
          ) : (
            debouncedSearchQuery ? i18n.t(i18n.keys.no_campaigns_match_search) : i18n.t(i18n.keys.no_campaigns_found)
          )}
        </Text>
        <div className={styles.paginationControls}>
          <Button 
            appearance="secondary" 
            disabled={currentPage === 1 || isLoading}
            onClick={handlePreviousPage}
          >
            {i18n.t(i18n.keys.previous)}
          </Button>
          <Text size={300}>
            {i18n.t(i18n.keys.page)} {currentPage} {pagination.total ? `of ${Math.ceil(pagination.total / pageSize)}` : ''}
          </Text>
          <Button 
            appearance="secondary" 
            disabled={!pagination.hasMore && currentPage >= Math.ceil(pagination.total / pageSize) || isLoading}
            onClick={handleNextPage}
          >
            {i18n.t(i18n.keys.next)}
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Campaigns;