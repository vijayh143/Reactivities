import { Button, Grid, Header,  Tab } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import ProfileUpdate from "./ProfileUpdate";


export default observer(function ProfileAbout(){
    const {profileStore: {isCurrentUser,profile}} = useStore();
    const [editMode, setEditMode] = useState(false);

    return(
    
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon={'user'} content={`About ${profile?.displayName}`} />
                    {isCurrentUser && (
                        <Button 
                            basic 
                            floated="right" 
                            content={editMode ? 'Cancel':' Edit Profile'}
                            onClick = {() => setEditMode(!editMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                   {editMode ? 
                    (
                        <ProfileUpdate setEditMode={setEditMode}/>
                    ) 
                    :(
                       <span style={{whiteSpace : 'pre-wrap'}}>{profile?.bio} </span>     
                    )}
                </Grid.Column>
            </Grid>
            
        </Tab.Pane>
        
    )
})