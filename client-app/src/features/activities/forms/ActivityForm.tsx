import React, {  useEffect, useState } from "react";
import { Button,Header,Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import {  ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/forms/MyTextInput";
import MyTextArea from "../../../app/common/forms/MyTextArea";
import MySelectInput from "../../../app/common/forms/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/forms/MyDateInput";
import {v4 as uuid } from "uuid";    


export default observer(function ActivityForm() {

    const {activityStore} = useStore();
    const {createActivity,updateActivity,loadActivity,loadingInitial} = activityStore;
    
    const {id} =useParams();
const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    useEffect( () => {
        if(id) loadActivity(id).then(activity => setActivity(activity!))
    },[id,loadActivity])

    const validationSchema = Yup.object({
       title : Yup.string().required('The activity title is required'),
       description: Yup.string().required('The activity description is required'),
       category: Yup.string().required(),
       city: Yup.string().required(),
       venue: Yup.string().required(),
       date: Yup.string().required()
       
    })

    
  
    function handleFormSubmit(activity: ActivityFormValues){
        if(!activity.id)
        {
            activity.id=uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))

        }else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
       
    }


    if(loadingInitial) return <LoadingComponent content='Loading activity'/>
  

    return(
        <Segment clearing>
            <Header content='Activity Details' sub color="teal"/>
            <Formik 
            validationSchema={validationSchema}
            enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isSubmitting,isValid,dirty}) =>(
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                   
                    <MyTextInput placeholder='Title' name='title' />
                    <MyTextArea rows={3} placeholder='Description' name='description' />
                    <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                    <MyDateInput 
                        placeholderText='Date'  
                        name='date' 
                        showTimeSelect
                        timeCaption="time"
                        dateFormat='MMMM d, yyyy h:mm aa'
                    />
                    <Header content='Location Details' sub color="teal"/>
                    <MyTextInput placeholder='City' name='city'  />
                    <MyTextInput placeholder='Venue'  name='venue' />
                    <Button 
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting} 
                        floated='right' positive content='Submit' type='submit'/>
                    <Button as={Link} to='/activities' floated='right' content='Cancel' type='button'/>
                </Form>
                )}

            </Formik>
            
        </Segment>
    )
} 
)