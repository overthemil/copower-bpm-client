import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import { InstallProgress } from '../../components/installs/install-progress';
import { InstallCustomer } from '../../components/installs/install-customer';
import { InstallPropertyDetails } from '../../components/installs/install-property-details';
import { InstallPropertyDialog } from '../../components/installs/install-property-dialog';
import { InstallChooseCustomerDialog } from '../../components/installs/install-choose-customer-dialog';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { useOutletContext } from 'react-router-dom';

export const InstallSummary = () => {
    const [installState, setRefresh] = useOutletContext();

    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);

    const renderContent = () => {
        if (installState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (installState.error) {
            return (
                <Box sx={{ py: 4 }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: 'background.default',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 3,
                        }}
                    >
                        <PriorityHighOutlinedIcon />
                        <Typography
                            color="textSecondary"
                            sx={{ mt: 2 }}
                            variant="body2"
                        >
                            {installState.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container spacing={3}>
                    <Grid
                        container
                        item
                        lg={8}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <InstallCustomer
                                onEdit={() => setOpenCustomerDialog(true)}
                                install={installState.data}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InstallPropertyDetails
                                onEdit={() => setOpenPropertyDialog(true)}
                                install={installState.data}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        lg={4}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <InstallProgress install={installState.data} />
                        </Grid>
                    </Grid>
                </Grid>
                <InstallChooseCustomerDialog
                    onClose={() => setOpenCustomerDialog(false)}
                    open={openCustomerDialog}
                    install={installState.data}
                    refresh={setRefresh}
                />
                <InstallPropertyDialog
                    onClose={() => setOpenPropertyDialog(false)}
                    open={openPropertyDialog}
                    install={installState.data}
                    refresh={setRefresh}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Install | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1,
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    {renderContent()}
                </Container>
            </Box>
        </>
    );
};
