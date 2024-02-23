import { IonButton, IonContent, IonPage, useIonModal } from '@ionic/react';
import { useContext, useState } from 'react';
import { AppContext } from '../App';
import WorkoutCard from './WorkoutCard';
import WorkoutEditModal from '../modals/WorkoutEditModal';
import './mainpage.css';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';

const MainPage: React.FC = () => {
  const { workouts } = useContext(AppContext);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const [present, dismiss] = useIonModal(WorkoutEditModal, {
    id: currentId,
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });

  const openEditModal = () => {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        console.log(ev);
      },
    });
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <h1 style={{ fontWeight: '900' }} className='ion-padding-bottom'>My Workouts!</h1>
        <IonButton onClick={() => {setCurrentId(undefined); openEditModal();}} expand="block" color={'secondary'} size='default'>
          Create a Workout
        </IonButton>
        {
          workouts.map((w, index) => (
            <WorkoutCard key={index} workout={w} openEditPage={() => { setCurrentId(w.id); openEditModal(); }} />
          ))
        }
      </IonContent>
    </IonPage>
  );
};

export default MainPage;
