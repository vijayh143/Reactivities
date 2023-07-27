import React from "react";
import {  Button,  Card,  Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";



export default function ActivityDetails() {

  const {activityStore} = useStore();
  const {selectedActivity:activity, openForm, cancelActivity} =activityStore;

  if(!activity) return (<LoadingComponent/>);

    return (
      <Card fluid>
        <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
        <Card.Content>
          <Card.Header>{activity.title}</Card.Header>
          <Card.Meta>
            <span >{activity.date}</span>
          </Card.Meta>
          <Card.Description>
           {activity.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
           <Button.Group widths='2'>
                <Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit'/>
                <Button onClick={cancelActivity} basic color='blue' content='Cancel'/>
           </Button.Group>
        </Card.Content>
      </Card>
    );

}