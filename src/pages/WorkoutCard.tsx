import { IonActionSheet, IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, useIonModal } from '@ionic/react';
import { ellipsisVertical, play } from 'ionicons/icons';
import { Fragment, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../App';
import { Workout } from '../models/workout';
import './workoutcard.css';
import WorkoutDetailsModal from '../modals/WorkoutDetailsModal';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';

enum ConfirmButtons {
    Ok = 'ok',
    Cancel = 'cancel'
}

interface WorkoutCardProps {
    workout: Workout;
    openEditPage: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = (props) => {
    const { workout, openEditPage } = props;
    const { storage, setWorkouts } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    
    const [present, dismiss] = useIonModal(WorkoutDetailsModal, {
        workout: workout,
        onDismiss: (data: string, role: string) => dismiss(data, role),
      });

    const openDetailsModal = () => {
        present({
        onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            console.log(ev);
        },
        });
    }

    if (!workout) return null;

    return (
        <IonCard className="ion-no-padding ion-no-margin ion-margin-top">
            <IonCardHeader>
                <IonGrid className="ion-no-padding ion-no-margin">
                    <IonRow class="ion-justify-content-end ion-align-items-center">
                        <IonCol size='10'>
                            <h3 className="ion-no-padding ion-no-margin" style={{ fontWeight: '600' }}>
                                {workout.name}
                            </h3>
                        </IonCol>
                        <IonCol size='2'>
                            <IonButton id={`open-${workout.id}-sheet`} fill='clear' size='small'>
                                <IonIcon slot='icon-only' icon={ellipsisVertical} />
                            </IonButton>
                        </IonCol>
                        <IonActionSheet
                            trigger={`open-${workout.id}-sheet`}
                            header={workout.name}
                            buttons={[
                                {
                                    text: 'Edit',
                                    data: {
                                        action: 'edit',
                                    },
                                    handler() {
                                        openEditPage();
                                    },
                                },
                                {
                                    text: 'Rename',
                                    role: 'rename',
                                    data: {
                                        action: 'rename',
                                    },
                                    handler() {
                                        setIsOpen(true)
                                    },
                                },
                                {
                                    text: 'Duplicate',
                                    role: 'duplicate',
                                    data: {
                                        action: 'duplicate',
                                    },
                                    handler() {
                                        storage.get('workouts').then((workouts: Workout[]) => {
                                            const modifiedWorkout = { ...workout, id: uuidv4() };
                                            storage.set('workouts', [...workouts, modifiedWorkout]).then((result: Workout[]) => {
                                                setWorkouts(result);
                                            })
                                        })
                                    },
                                },
                                {
                                    text: 'Delete',
                                    role: 'destructive',
                                    data: {
                                        action: 'delete',
                                    },
                                    handler() {
                                        storage.get('workouts').then((workouts: Workout[]) => {
                                            let index = workouts.findIndex(w => w.id == workout.id);
                                            if (index !== -1) {
                                                const updatedWorkouts = [...workouts.slice(0, index), ...workouts.slice(index + 1)];
                                                storage.set('workouts', updatedWorkouts).then((result: Workout[]) => {
                                                    setWorkouts(result);
                                                });
                                            }
                                        })
                                    },
                                },
                            ]}
                        />
                    </IonRow>
                </IonGrid>
            </IonCardHeader>
            <IonCardContent >
                <IonGrid className="ion-no-padding ion-no-margin ion-padding-bottom">
                    {
                        workout.cycle && workout.cycle.map((cycle, index) => (
                                <IonRow key={index} className='ion-align-items-center ion-justify-content-end'>
                                    <IonCol size='1'>{cycle?.reps?.length}</IonCol>
                                    <IonCol size='1'>
                                        x
                                    </IonCol>
                                    <IonCol size='10' className='ion-card-list-item ion-padding-end'>
                                        <IonLabel>{cycle.set.exercise.name}</IonLabel>
                                    </IonCol>
                                </IonRow>
                            )
                        )
                    }
                </IonGrid>
                <IonItem></IonItem>
                <IonButton onClick={() => {openDetailsModal()}} className='ion-no-margin ion-no-padding ion-margin-top' size='small' expand='block' fill='clear'>
                    <IonLabel slot='start'>Enter Workout!</IonLabel>
                </IonButton>
            </IonCardContent>
            <IonAlert
                isOpen={isOpen}
                header="Name"
                buttons={[{ text: 'Cancel', role: ConfirmButtons.Cancel }, { text: 'Rename', role: ConfirmButtons.Ok }]}
                inputs={[
                    {
                        placeholder: workout.name,
                        value: workout.name,
                    },
                ]}
                onDidDismiss={(detail) => {
                    if (detail.detail.role == ConfirmButtons.Ok) {
                        storage.get('workouts').then((workouts: Workout[]) => {
                            let index = workouts.findIndex(w => w.id == workout.id);
                            if (index !== -1) {
                                const modifiedWorkout = { ...workouts[index], name: detail.detail.data.values[0] };
                                const updatedWorkouts = [...workouts.slice(0, index), modifiedWorkout, ...workouts.slice(index + 1)];
                                storage.set('workouts', updatedWorkouts).then((result: Workout[]) => {
                                    setWorkouts(result);
                                });
                            }
                        })
                    }
                    setIsOpen(false);
                }}
            ></IonAlert>
        </IonCard>
    );
};

export default WorkoutCard;


