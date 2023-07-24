import React from "react";
import { Activity } from "../../../app/models/activity";
import { Button, Item, Label, Segment } from "semantic-ui-react";

interface Props{
    activities: Activity[];
    selectActivity:(id:string) => void;
    deleteActivity:(id:string) => void
}

export default function ActivityList({activities,selectActivity,deleteActivity}:Props) {
    return (
      <Segment>
        <Item.Group>
          {activities.map((activity) => (
            <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>{activity.city}, {activity.venue}</div>
              </Item.Description>
              <Item.Extra>
                <Button onClick={() =>selectActivity(activity.id)} floated="right" color="blue" content="View"/>
                <Button onClick={() =>deleteActivity(activity.id)} floated="right" color="red" content="Delete"/>
                <Label basic content={activity.category}/>
              </Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      </Segment>
    );
}