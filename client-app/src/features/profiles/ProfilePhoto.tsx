import { observer } from "mobx-react-lite";
import { Card, Header, Tab,Image, Grid, Button } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import {  SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/photoUploadWidget";



interface Props{
    profile: Profile;
}

export default observer(function ProfilePhoto({profile}:Props){
  const {profileStore : {isCurrentUser, uploadPhoto,uploading, loading, setMain,deletePhoto}}= useStore();
  const [addPhotoMode, setAddPhotoMode] =useState(false);
  const [target,setTarget] = useState('');

  function handlePhotoUpload(file : Blob)
  {
    uploadPhoto(file).then (() => setAddPhotoMode(false));
  }

  function handleSetMainPhoto(photo:Photo, e:SyntheticEvent<HTMLButtonElement>)
  {
    setTarget(e.currentTarget.name);
    setMain(photo);
  }

  function handleDeletePhoto (photo:Photo, e:SyntheticEvent<HTMLButtonElement>)
  {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  }
    
    return (
      <Tab.Pane>
        <Grid>
            <Grid.Column width={16}>
              <Header floated="left" icon={"image"} content="Photos" />
                {isCurrentUser && (
                  <Button floated="right" basic 
                    content= {addPhotoMode ? "Cancel" : "Add Photo"}
                    onClick={ () => {setAddPhotoMode(!addPhotoMode)}}
                  />
                )}
            </Grid.Column>
            <Grid.Column width={16}>
              {addPhotoMode ? (
               <PhotoUploadWidget uploadPhoto ={handlePhotoUpload} loading={uploading}/>
              ) : (
                   <Card.Group itemsPerRow={5}>
                   {profile.photos?.map(photo => (
                       <Card key={photo.id}>
                         <Image src={photo.url} />
                         {isCurrentUser && (
                          <Button.Group fluid widths={2}>
                            <Button 
                              basic
                              color="green"
                              content='Main'
                              name={photo.id}
                              disabled={photo.isMain}
                              onClick={e => handleSetMainPhoto(photo,e)}
                              loading ={target === photo.id && loading}

                            />
                            <Button  
                              basic color="red" 
                              icon='trash'
                              name ={'delete' + photo.id}
                              disabled = {photo.isMain} 
                              onClick={e => handleDeletePhoto(photo,e)}
                              loading = {target === 'delete' + photo.id && loading}/>
                              

                          </Button.Group>
                         )}
                       </Card>
                   ))}
                 </Card.Group>
              )}
             
            </Grid.Column>
        </Grid>
        
       
      </Tab.Pane>
    );
})