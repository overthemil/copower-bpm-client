import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// Material UI
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local Imports
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';

export const InstallSummary = () => {
    const [installState, setRefresh] = useOutletContext();
    const mounted = useMounted();

    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
    const [openAddressDialog, setOpenAddressDialog] = useState(false);

    const [phaseOptions, setPhaseOptions] = useState([]);
    const [existingSystemOptions, setExistingSystemOptions] = useState([]);
    const [storyOptions, setStoryOptions] = useState([]);
    const [roofTypeOptions, setRoofTypeOptions] = useState([]);
    const [roofPitchOptions, setRoofPitchOptions] = useState([]);

    const getData = useCallback(async () => {
        setPhaseOptions([]);
        setExistingSystemOptions([]);
        setStoryOptions([]);
        setRoofTypeOptions([]);
        setRoofPitchOptions([]);

        try {
            const phasesAPI = await bpmAPI.getPhaseOptions();
            const phasesResult = phasesAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.num,
                };
            });
            const existingSystemAPI = await bpmAPI.getExistingSystemOptions();
            const existingSystemResult = existingSystemAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.comment,
                };
            });
            const storyOptionsAPI = await bpmAPI.getStoryOptions();
            const storyOptionsResult = storyOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.num,
                };
            });
            const roofTypeAPI = await bpmAPI.getRoofTypeOptions();
            const roofTypeResult = roofTypeAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });
            const roofPitchAPI = await bpmAPI.getRoofPitchOptions();
            const roofPitchResult = roofPitchAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });
            if (mounted.current) {
                setPhaseOptions(phasesResult);
                setExistingSystemOptions(existingSystemResult);
                setStoryOptions(storyOptionsResult);
                setRoofTypeOptions(roofTypeResult);
                setRoofPitchOptions(roofPitchResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setPhaseOptions(() => ({ error: err.message }));
                setExistingSystemOptions(() => ({ error: err.message }));
                setStoryOptions(() => ({ error: err.message }));
                setRoofTypeOptions(() => ({ error: err.message }));
                setRoofPitchOptions(() => ({ error: err.message }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const addressFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            address: installState.data?.property.address || '',
            address_id: installState.data?.property.address_id || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            address: Yup.string(),
            address_id: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let address_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    address_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenPropertyDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const addressFormFields = [
        {
            id: 1,
            variant: 'Address',
            label: 'Address',
            name: 'address',
            name_id: 'address_id',
            touched: addressFormik.touched.address,
            errors: addressFormik.errors.address,
            width: 12,
        },
    ];

    const propertyFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            phase_id: installState.data?.property.phase_id || '',
            existing_system_id:
                installState.data?.property.existing_system_id || '',
            story_id: installState.data?.property.story_id || '',
            retailer: installState.data?.property.retailer || '',
            roof_type_id: installState.data?.property.roof_type_id || '',
            roof_pitch_id: installState.data?.property.roof_pitch_id || '',
            distributor: installState.data?.property.distributor || '',
            nmi: installState.data?.property.nmi || '',
            meter: installState.data?.property.meter || '',
            comment: installState.data?.property.comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            phase_id: Yup.number(),
            existing_system_id: Yup.number(),
            story_id: Yup.number(),
            retailer: Yup.string(),
            roof_type_id: Yup.number(),
            roof_pitch_id: Yup.number(),
            distributor: Yup.string(),
            nmi: Yup.string(),
            meter: Yup.string(),
            comment: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let property_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    property_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenPropertyDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const propertyFormFields = [
        {
            id: 1,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.phase_id,
            errors: propertyFormik.errors.phase_id,
            value: propertyFormik.values.phase_id,
            label: 'Phases',
            name: 'phase_id',
            options: phaseOptions,
        },
        {
            id: 2,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.existing_system_id,
            errors: propertyFormik.errors.existing_system_id,
            value: propertyFormik.values.existing_system_id,
            label: 'Existing System',
            name: 'existing_system_id',
            options: existingSystemOptions,
        },
        {
            id: 3,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.roof_type_id,
            errors: propertyFormik.errors.roof_type_id,
            value: propertyFormik.values.roof_type_id,
            label: 'Roof Type',
            name: 'roof_type_id',
            options: roofTypeOptions,
        },
        {
            id: 4,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.story_id,
            errors: propertyFormik.errors.story_id,
            value: propertyFormik.values.story_id,
            label: 'Stories',
            name: 'story_id',
            options: storyOptions,
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.retailer,
            errors: propertyFormik.errors.retailer,
            value: propertyFormik.values.retailer,
            label: 'Retailer',
            name: 'retailer',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.nmi,
            errors: propertyFormik.errors.nmi,
            value: propertyFormik.values.nmi,
            label: 'NMI',
            name: 'nmi',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.distributor,
            errors: propertyFormik.errors.distributor,
            value: propertyFormik.values.distributor,
            label: 'Distributor',
            name: 'distributor',
        },
        {
            id: 8,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.meter,
            errors: propertyFormik.errors.meter,
            value: propertyFormik.values.meter,
            label: 'Meter Number',
            name: 'meter',
        },
        {
            id: 9,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.roof_pitch_id,
            errors: propertyFormik.errors.roof_pitch_id,
            value: propertyFormik.values.roof_pitch_id,
            label: 'Roof Pitch',
            name: 'roof_pitch_id',
            options: roofPitchOptions,
        },
        {
            id: 10,
            variant: 'Input',
            width: 12,
            touched: propertyFormik.touched.comment,
            errors: propertyFormik.errors.comment,
            value: propertyFormik.values.comment,
            label: 'Property Comment',
            name: 'comment',
        },
    ];

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
                            <InfoCard
                                onEdit={() => setOpenPropertyDialog(true)}
                                title="Customer"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Customer Name',
                                        value: installState.data.customer.name,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company Name',
                                        value: installState.data.customer
                                            .company,
                                    },
                                    {
                                        id: 3,
                                        label: 'Email Address',
                                        value: installState.data.customer.email,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Address',
                                        value: installState.data.property
                                            .address,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company ABN',
                                        value: installState.data.customer.abn,
                                    },
                                    {
                                        id: 3,
                                        label: 'Phone Number',
                                        value: installState.data.customer.phone,
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenPropertyDialog(true)}
                                title="Property Details"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Phases',
                                        value: installState.data.property.phase,
                                    },
                                    {
                                        id: 2,
                                        label: 'Roof Type',
                                        value: installState.data.property
                                            .roof_type,
                                    },
                                    {
                                        id: 3,
                                        label: 'Retailer',
                                        value: installState.data.property
                                            .retailer,
                                    },
                                    {
                                        id: 4,
                                        label: 'NMI',
                                        value: installState.data.property.nmi,
                                    },
                                    {
                                        id: 5,
                                        label: 'Comment',
                                        value: installState.data.property
                                            .comment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Existing System',
                                        value: installState.data.property
                                            .existing_system,
                                    },
                                    {
                                        id: 2,
                                        label: 'Stories',
                                        value: installState.data.property.story,
                                    },
                                    {
                                        id: 3,
                                        label: 'Distributor',
                                        value: installState.data.property
                                            .distributor,
                                    },
                                    {
                                        id: 4,
                                        label: 'Meter Number',
                                        value: installState.data.property.meter,
                                    },
                                    {
                                        id: 5,
                                        label: 'Roof Pitch',
                                        value: installState.data.property
                                            .roof_pitch,
                                    },
                                ]}
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
                            {/* <InstallProgress install={installState.data} /> */}
                        </Grid>
                    </Grid>
                </Grid>
                <FormDialog
                    onClose={() => setOpenAddressDialog(false)}
                    open={openAddressDialog}
                    formik={addressFormik}
                    title="Edit Address"
                    fields={addressFormFields}
                />
                <FormDialog
                    onClose={() => setOpenPropertyDialog(false)}
                    open={openPropertyDialog}
                    formik={propertyFormik}
                    title="Edit Property Details"
                    fields={propertyFormFields}
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