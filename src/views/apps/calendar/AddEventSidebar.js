// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

import { fetchAllClienti } from 'src/store/clienti'
import { fetchAllServizi, fetchServizio } from 'src/store/servizi'
import { format } from 'date-fns-tz'
import { sub } from 'date-fns'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  title: '',
  allDay: false,
  description: '',
  endDate: new Date(),
  startDate: new Date(),
  servizi: []
}

const AddEventSidebar = props => {
  // ** Props
  const {
    store,
    dispatch,
    addEvent,
    updateEvent,
    drawerWidth,
    calendarApi,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // ** States
  const [values, setValues] = useState(defaultState)

  const [clientiOptions, setClientiOptions] = useState([])
  const [serviziOptions, setserviziOptions] = useState([])

  useEffect(() => {
    const fetchClienti = async () => {
      try {
        const clientiData = await dispatch(fetchAllClienti({}))
        setClientiOptions(clientiData.payload.data.data)
      } catch (error) {
        console.error('Errore durante il recupero dei clienti:', error.message)
      }
    }

    fetchClienti()
  }, [dispatch])

  useEffect(() => {
    const fetchServizi = async () => {
      try {
        const serviziData = await dispatch(fetchAllServizi({}))

        setserviziOptions(serviziData.payload.data)
      } catch (error) {
        console.error('Errore durante il recupero dei servizi:', error.message)
      }
    }

    fetchServizi()
  }, [dispatch])

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }

  const onSubmit = data => {
    const modifiedEvent = {
      display: 'block',
      title: data.title,
      end: format(new Date(values.endDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timeZone: 'Europe/Rome' }),
      allDay: values.allDay,
      start: format(new Date(values.startDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timeZone: 'Europe/Rome' }),
      extendedProps: {
        servizi: values.servizi && values.servizi.length ? values.servizi : undefined,
        description: values.description.length ? values.description : undefined
      }
    }
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      console.log(modifiedEvent)
      dispatch(addEvent(modifiedEvent))
    } else {
      dispatch(updateEvent({ id: store.selectedEvent.id, ...modifiedEvent }))
    }
    calendarApi.refetchEvents()
    handleSidebarClose()
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }

    // calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent
      setValue('title', event.title || '')
      setValues({
        title: event.title || '',
        allDay: event.allDay,
        servizi: event.extendedProps.servizi || [],
        description: event.extendedProps.description || '',
        endDate: event.end !== null ? sub(event.end, { hours: 1 }) : event.start,
        startDate: event.start !== null ? sub(event.start, { hours: 1 }) : new Date()
      })
    }
  }, [setValue, store.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])
  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  const RenderSidebarFooter = () => {
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Aggiungi
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button type='submit' variant='contained' sx={{ mr: 4 }}>
            Modifica aspitt ci non funzion
          </Button>
          <Button variant='tonal' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>
        </Fragment>
      )
    }
  }

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          p: 6,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h5'>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? 'Update Event' : 'Add Event'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {store.selectedEvent !== null && store.selectedEvent.title.length ? (
            <IconButton
              size='small'
              onClick={handleDeleteEvent}
              sx={{ color: 'text.primary', mr: store.selectedEvent !== null ? 1 : 0 }}
            >
              <Icon icon='tabler:trash' fontSize='1.25rem' />
            </IconButton>
          ) : null}
          <IconButton
            size='small'
            onClick={handleSidebarClose}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Controller
              control={control}
              rules={{ required: true }}
              name='title'
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomAutocomplete
                  name='title'
                  label='Clienti'
                  sx={{ mb: 4 }}
                  options={clientiOptions}
                  value={clientiOptions.find(option => option.id === value) || null}
                  onChange={(e, newValue) => {
                    onChange(newValue ? newValue.id : '')
                  }}
                  onBlur={onBlur}
                  getOptionLabel={option => `${option.nome || ''} ${option.cognome || ''}`}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      label='Cliente'
                      helperText={errors.title && 'This field is required'}
                    />
                  )}
                />
              )}
            />

            <CustomTextField
              select
              fullWidth
              label='Servizi'
              sx={{ mb: 4 }}
              SelectProps={{
                multiple: true,
                value: values.servizi.map(servizio => servizio.id),
                onChange: e => {
                  const selectedServizi = serviziOptions.filter(servizio => e.target.value.includes(servizio.id))
                  const newEndDate = calculateEndDate(values.startDate, selectedServizi)
                  setValues({
                    ...values,
                    servizi: selectedServizi,
                    endDate: newEndDate
                  })
                }
              }}
            >
              {serviziOptions.map(servizio => (
                <MenuItem key={servizio.id} value={servizio.id}>
                  {servizio.nome}
                </MenuItem>
              ))}
            </CustomTextField>
            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsStart
                id='event-start-date'
                timeIntervals={10}
                endDate={values.endDate}
                selected={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'hh:mm dd-MM-yyyy' : 'dd-MM-yyyy'}
                customInput={<PickersComponent label='Start Date' registername='startDate' />}
                onChange={date => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <DatePicker
                selectsEnd
                timeIntervals={10}
                id='event-end-date'
                endDate={values.endDate}
                selected={values.endDate}
                minDate={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'hh:mm dd-MM-yyyy' : 'dd-MM-yyyy'}
                customInput={<PickersComponent label='End Date' registername='endDate' />}
                onChange={date => {
                  setValues({ ...values, endDate: date })
                }}
              />
            </Box>
            <FormControl sx={{ mb: 4 }}>
              <FormControlLabel
                label='All Day'
                control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
              />
            </FormControl>
            <CustomTextField
              rows={4}
              multiline
              fullWidth
              sx={{ mb: 6.5 }}
              label='Descrizione'
              id='event-description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

const calculateEndDate = (date, servizi) => {
  let totalDuration = servizi.reduce((acc, servizo) => {
    return acc + Number(servizo.durata)
  }, 0)

  const totalDurationInMilliseconds = totalDuration * 60 * 1000

  const newEndDate = new Date(date.getTime() + totalDurationInMilliseconds)

  return newEndDate
}

export default AddEventSidebar
