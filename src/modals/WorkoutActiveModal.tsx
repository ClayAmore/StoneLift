import { InputChangeEventDetail, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonThumbnail, IonToolbar, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { arrowBack, checkbox, helpCircleOutline, save } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Workout } from '../models/workout';
import ExerciseDetailModal from './ExerciseDetailModal';
import TimerModal from './TimerModal';
import { WorkoutHistoryEntry } from '../models/history';
import { v4 as uuidv4 } from 'uuid';

interface InputCustomEvent extends CustomEvent {
    detail: InputChangeEventDetail;
    target: HTMLIonInputElement;
}

const defaultValues: WorkoutHistoryEntry = {
    id: '',
    name: '',
    startTime: Date.now().toString(),
    endTime: Date.now().toString(),
    cycles: [{
        sets: []
    }]
}


interface WorkoutActiveModalProps {
    workout: Workout;
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

const WorkoutActiveModal: React.FC<WorkoutActiveModalProps> = (props) => {
    const {workout, onDismiss} = props;
    const [workoutHistoryEntry, setWorkoutHistoryEntry] = useState<WorkoutHistoryEntry>({ ...defaultValues });
    const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentRepsValue, setCurrentRepsValue] = useState(workout.cycle[currentCycleIndex].reps[currentSetIndex]);
    const [currentWeightValue, setCurrentWeightValue] = useState(workout.cycle[currentCycleIndex].weight[currentSetIndex]);
    const { storage, setHistoryEntries } = useContext(AppContext);

    useEffect(() => {
        const newHistoryEntry: WorkoutHistoryEntry = JSON.parse(JSON.stringify(defaultValues));
        newHistoryEntry.name = workout.name;
        newHistoryEntry.id = uuidv4();
        newHistoryEntry.startTime = Date.now().toString(),
        setCurrentCycleIndex(0);
        setCurrentSetIndex(0);
        setWorkoutHistoryEntry(newHistoryEntry);
    }, []);

    const [presentTimerModal, dismissTimerModal] = useIonModal(TimerModal, {
        id: workout.id,
        onDismiss: (data: string, role: string) => dismissTimerModal(data, role),
    });

    const openTimerModal = () => {
        presentTimerModal({
            onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            },
        });
    }

    const [presentExerciseDetailModal, dismissExerciseDetailModal] = useIonModal(ExerciseDetailModal, {
        exercise: workout.cycle[currentCycleIndex].set.exercise,
        onDismiss: (data: string, role: string) => dismissExerciseDetailModal(data, role),
    });

    const openExerciseDetailModal = () => {
        presentExerciseDetailModal({
            onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            },
        });
    }

    const next = () => {
        const nextSetIndex = currentSetIndex + 1;
    
        const modifiedWorkoutHistoryEntry: WorkoutHistoryEntry = {...workoutHistoryEntry};
    
        modifiedWorkoutHistoryEntry.cycles[currentCycleIndex].sets.push({
            exercise: workout.cycle[currentCycleIndex].set.exercise,
            reps: currentRepsValue,
            weight: currentWeightValue
        });
    
        // Push the set data into the workoutHistoryEntry
    
        if (nextSetIndex === workout.cycle[currentCycleIndex].iterations) {
            if (currentCycleIndex < workout.cycle.length - 1) {
                setCurrentSetIndex(0);
                setCurrentCycleIndex(currentCycleIndex + 1);
    
                // Add new cycle
                modifiedWorkoutHistoryEntry.cycles.push({
                    sets: []
                });
            } else {
                setWorkoutHistoryEntry({...modifiedWorkoutHistoryEntry});
                return saveAndDismiss();
            }
        } else {
            setCurrentSetIndex(currentSetIndex + 1);
        }
    
        setCurrentWeightValue(workout.cycle[currentCycleIndex].weight[currentSetIndex]);
        setCurrentRepsValue(workout.cycle[currentCycleIndex].reps[currentSetIndex]);
        openTimerModal();
        setWorkoutHistoryEntry({...modifiedWorkoutHistoryEntry});
    };

    const saveAndDismiss = async () => {
        try {
            // Retrieve existing history entries from storage
            const existingHistoryEntries = await storage.get('historyEntries');
    
            // Create a modified copy of the workout history entry with an end time
            const modifiedWorkoutHistoryEntry: WorkoutHistoryEntry = {...workoutHistoryEntry};
            modifiedWorkoutHistoryEntry.endTime = Date.now().toString();
    
            // Ensure historyEntries is correctly initialized as an array
            const modifiedHistoryEntries = existingHistoryEntries ? [...existingHistoryEntries] : [];
    
            // Add the modified entry to the array
            modifiedHistoryEntries.push(modifiedWorkoutHistoryEntry);
    
            // Update the storage with the modified history entries
            setHistoryEntries(await storage.set('historyEntries', modifiedHistoryEntries));
    
            // Finally, dismiss the modal
            onDismiss();
        } catch (error) {
            console.error('Error while saving history entry:', error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="end">
                        <IonButton onClick={() => { saveAndDismiss() }}>End Workout</IonButton> 
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonList className="ion-no-padding">
                    <IonThumbnail>
                        <IonImg alt={workout.cycle[currentCycleIndex].set.exercise.name} src={`.\\exercises\\${workout.cycle[currentCycleIndex].set.exercise.images[1]}`} />
                    </IonThumbnail>
                    <h1 style={{ textAlign: 'center' }}>{workout.cycle[currentCycleIndex].set.exercise.name}</h1>
                    <IonItem className='ion-no-padding ion-no-margin'>
                        <IonLabel className='ion-no-margin ion-text-wrap ion-text-capitalize'>{workout.cycle[currentCycleIndex].set.exercise.primaryMuscles.join(', ')}</IonLabel>
                        <IonButton slot='end' fill='clear' onClick={() => { openExerciseDetailModal() }} ><IonIcon slot='icon-only' icon={helpCircleOutline}></IonIcon></IonButton>
                    </IonItem>
                    <IonList>
                        <IonGrid>
                            <IonRow>
                                <IonCol size='5'>
                                    <IonLabel>Weight</IonLabel>
                                </IonCol>
                                <IonCol size='5'>
                                    <IonLabel>Reps</IonLabel>
                                </IonCol>
                                <IonCol size='2'>
                                    <IonLabel>State</IonLabel>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        {
                            workout.cycle[currentCycleIndex].reps.map((r, index) => {
                                let weightValue = workout.cycle[currentCycleIndex].weight[index];
                                let repsValue = r;

                                if(index < currentSetIndex) {
                                    weightValue = workoutHistoryEntry.cycles[currentCycleIndex].sets[index].weight;
                                    repsValue = workoutHistoryEntry.cycles[currentCycleIndex].sets[index].reps;
                                }

                                if(index == currentSetIndex) {
                                    weightValue = currentWeightValue;
                                    repsValue = currentRepsValue;
                                }
                                

                                return (
                                    <IonGrid key={index}>
                                        <IonRow className='ion-align-items-center'>
                                            <IonCol size='5'>
                                                <IonInput onIonInput={(detail) => { 
                                                    if(!detail.detail.value) return;
                                                    if(index == currentSetIndex) setCurrentWeightValue(parseInt(detail.detail.value))
                                                }} fill="outline" value={weightValue} type="number" placeholder="0"></IonInput>
                                            </IonCol>
                                            <IonCol size='5'>
                                                <IonInput onIonInput={(detail) => {
                                                    if(!detail.detail.value) return;
                                                    if(index == currentSetIndex) setCurrentRepsValue(parseInt(detail.detail.value))
                                                 }} fill="outline" value={repsValue} type="number" placeholder="0"></IonInput>
                                            </IonCol>
                                            <IonCol size='2'>
                                                {
                                                    currentSetIndex > index ? (
                                                        <IonIcon size='large' icon={checkbox} color='success' ></IonIcon>
                                                    ) : (
                                                        currentSetIndex == index ? (
                                                            <IonIcon size='large' icon={arrowBack} ></IonIcon>
                                                        ) : (
                                                            null
                                                        )
                                                    )
                                                }
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                )
                            })}
                    </IonList>
                </IonList>
            </IonContent>
            <IonFooter className='ion-padding'>
                <IonButton onClick={() => { next();}} color='secondary' expand='block' size='large'>Log Set & Rest</IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default WorkoutActiveModal;
