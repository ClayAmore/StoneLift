import { IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { chevronBack } from 'ionicons/icons';
import { Fragment } from 'react';
import { Exercise } from '../models/exercise';
import './exerciseDetailModal.css';

interface ExerciseDetailModalProps {
    exercise: Exercise | undefined;
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
} 

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = (props) => {
    const { exercise, onDismiss} = props;

    if(!exercise) return null;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => onDismiss()}>
                            <IonIcon slot='icon-only' icon={chevronBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle >{exercise?.name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" fullscreen>
                <div style={{backgroundColor:'#63809D'}}>
                    <IonImg style={{ mixBlendMode: 'overlay'}} alt={exercise?.name} src={`.\\exercises\\${exercise?.images[1]}`} />
                </div>
                <IonGrid className="ion-no-padding ion-no-margin ion-margin-top">
                    <IonRow class="ion-align-items-start">
                        <IonCol>
                            <IonChip className='ion-no-margin ion-margin-bottom' color={exercise?.level == "intermediate" ? "warning" : ( exercise?.level == "expert" ? "secondary" : "success")} outline>{exercise?.level}</IonChip>
                            <h1 className="ion-no-padding ion-no-margin" style={{fontWeight: 900}}>{exercise?.name}</h1>
                        </IonCol>
                        <IonCol size="auto">
                            <IonImg style={{width: '2.5rem'}} src={`.\\assets\\${exercise?.primaryMuscles[0]}.png`} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonList>
                    <IonItem className='ion-no-padding ion-no-margin'>
                        <IonLabel>
                            Force:
                        </IonLabel>
                        <IonLabel class='ion-text-capitalize'>
                            {exercise?.force}
                        </IonLabel>
                    </IonItem>
                    <IonItem className='ion-no-padding ion-no-margin'>
                        <IonLabel>
                            Mechanic:
                        </IonLabel>
                        <IonLabel class='ion-text-capitalize'>
                            {exercise?.mechanic}
                        </IonLabel>
                    </IonItem>
                    <IonItem className='ion-no-padding ion-no-margin'>
                        <IonLabel>
                            Equipment:
                        </IonLabel>
                        <IonLabel class='ion-text-capitalize'>
                            {exercise?.equipment}
                        </IonLabel>
                    </IonItem>
                    <IonItem className='ion-no-padding ion-no-margin'>
                        <IonLabel>
                            Category:
                        </IonLabel>
                        <IonLabel class='ion-text-capitalize'>
                            {exercise?.category}
                        </IonLabel>
                    </IonItem>
                </IonList>
                <h3>Instructions</h3>
                <IonList lines='none'>
                    {
                        exercise?.instructions && exercise.instructions.map((instruction, index) => (
                            <Fragment key={index}>
                                <IonItem className="ion-no-padding ion-no-margin">
                                    <IonLabel className="ion-no-padding ion-no-margin"><b>{`Step ${index+1}`}</b></IonLabel>
                                </IonItem>
                                <IonItem className="ion-no-padding ion-no-margin">
                                    <IonLabel className='ion-no-padding ion-no-margin ion-text-wrap'>{instruction}</IonLabel>
                                </IonItem>
                            </Fragment>
                        ))
                    }
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ExerciseDetailModal;
