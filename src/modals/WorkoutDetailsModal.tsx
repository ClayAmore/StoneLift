import { InputChangeEventDetail, IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonReorder, IonRow, IonToolbar, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { arrowBack, createOutline, helpCircleOutline } from 'ionicons/icons';
import { Fragment } from 'react';
import { Exercise } from '../models/exercise';
import { Workout } from '../models/workout';
import ExerciseDetailModal from './ExerciseDetailModal';
import WorkoutActiveModal from './WorkoutActiveModal';
import WorkoutEditModal from './WorkoutEditModal';

interface InputCustomEvent extends CustomEvent {
    detail: InputChangeEventDetail;
    target: HTMLIonInputElement;
}

const defaultValues: Workout = {
    name: '',
    cycle: [],
    id: ''
}

interface WorkoutDetailsModalProps {
    workout: Workout;
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = (props) => {
    const { workout, onDismiss } = props;

    const [presentWorkoutEditModal, dismissWorkoutEditModal] = useIonModal(WorkoutEditModal, {
        id: workout.id,
        onDismiss: (data: string, role: string) => dismissWorkoutEditModal(data, role),
    });

    const openWorkoutEditModal = () => {
        presentWorkoutEditModal({
            onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            },
        });
    }

    const [presentWorkoutActiveModal, dismissWorkoutActiveModal] = useIonModal(WorkoutActiveModal, {
        workout: workout,
        onDismiss: (data: string, role: string) => dismissWorkoutActiveModal(data, role),
    });

    const openWorkoutActiveModal = () => {
        presentWorkoutActiveModal({
            onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
                onDismiss();
            },
        });
    }

    const SetHeader = (props: {exercise: Exercise}) => {
        const {exercise} = props;
        const [presentExerciseDetailModal, dismissExerciseDetailModal] = useIonModal(ExerciseDetailModal, {
            exercise: exercise,
            onDismiss: (data: string, role: string) => dismissExerciseDetailModal(data, role),
        });

        const openExerciseDetailModal = () => {
            presentExerciseDetailModal({
                onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
                },
            });
        }

        return (
            <IonItem className='ion-no-padding ion-no-margin'>
                <IonReorder slot='end'></IonReorder>
                <IonAvatar slot='start'>
                    <IonImg alt={exercise.name} src={`.\\exercises\\${exercise.images[1]}`} />
                </IonAvatar>
                <IonLabel className='ion-no-margin ion-text-wrap'>{exercise.name}</IonLabel>
                <IonButton fill='clear' onClick={() => {openExerciseDetailModal()}} ><IonIcon slot='icon-only' icon={helpCircleOutline}></IonIcon></IonButton>
            </IonItem>
        )
    }

    const cancel = () => {
        onDismiss();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => { cancel() }}>
                            <IonIcon slot='icon-only' icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={() => { openWorkoutEditModal() }}>
                            <IonIcon slot='start' icon={createOutline}></IonIcon>
                            Edit Workout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <h1>{workout?.name}</h1>
                <IonLabel>
                    <div className='ion-margin-top'>
                        <sub className='ion-margin-top'>Sets</sub>
                    </div>
                </IonLabel>
                <IonList>
                    {
                        workout.cycle.map((cycle, index) => {
                            const iterations = cycle.iterations;
                            const arr = [];
                            for (let i = 0; i < iterations; i++) {
                                arr.push(
                                    <IonGrid key={i}>
                                        <IonRow className='ion-align-items-center ion-justify-content-end'>
                                            <IonCol size='6'>
                                                <IonInput disabled={true} onIonInput={(detail) => { }} fill="outline" value={cycle.weight[i]} type="number" placeholder="0"></IonInput>
                                            </IonCol>
                                            <IonCol size='6'>
                                                <IonInput disabled={true} onIonInput={(detail) => { }} fill="outline" value={cycle.reps[i]} type="number" placeholder="0"></IonInput>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                )
                            }
                            return (
                                <Fragment key={index}>
                                    <SetHeader exercise={cycle.set.exercise} />
                                    <IonList>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size='6'>
                                                    <IonLabel>Weight</IonLabel>
                                                </IonCol>
                                                <IonCol size='6'>
                                                    <IonLabel>Reps</IonLabel>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                        {arr}
                                    </IonList>
                                </Fragment>
                            );
                        })
                    }
                </IonList>
            </IonContent>
            <IonFooter className='ion-padding' style={{ zIndex: '100' }}>
                <IonButton color='success' expand='block' onClick={() => { openWorkoutActiveModal() }}>
                    Start Workout
                </IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default WorkoutDetailsModal;
