import { InputChangeEventDetail, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonReorder, IonReorderGroup, IonRow, IonToolbar, ItemReorderEventDetail, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { addOutline, trashOutline } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../App';
import { Exercise } from '../models/exercise';
import { Workout } from '../models/workout';
import ExerciseListModal from './ExercisesListModal';
import './workoutEditModal.css';

interface InputCustomEvent extends CustomEvent {
    detail: InputChangeEventDetail;
    target: HTMLIonInputElement;
}

const defaultValues: Workout = {
    name: '',
    cycle: [],
    id: ''
}

interface WorkoutEditModalProps {
    id?: string;
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

const WorkoutEditModal: React.FC<WorkoutEditModalProps> = (props) => {
    const { id, onDismiss } = props;
    const { storage, workouts, setWorkouts } = useContext(AppContext);
    const [workout, setWorkout] = useState<Workout>({ ...defaultValues });

    useEffect(() => {
        if (!id) return setWorkout({ ...defaultValues });
        const wo = workouts.find(w => w.id == id);
        if (wo) setWorkout(JSON.parse(JSON.stringify(wo)));

    }, [id, workouts])

    const [present, dismiss] = useIonModal(ExerciseListModal, {
        onDismiss: (data: string, role: string) => dismiss(data, role),
    });

    const openModal = () => {
        present({
            onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
                const modifiedCycles = [...workout.cycle];
                const selectedExercises: Exercise[] = ev.detail.data;
                if(!selectedExercises) return;
                for (let i = 0; i < selectedExercises.length; i++) {
                    modifiedCycles.push({
                        iterations: 1,
                        reps: [10],
                        weight: [10],
                        set: {exercise: selectedExercises[i]}
                    });
                }
                setWorkout({...workout, cycle: modifiedCycles});
            },
        });
    }

    const nameChanged = (event: InputCustomEvent) => {
        setWorkout({ ...workout, name: event.detail.value ?? '' });
    }

    const cancel = () => {
        onDismiss();
    }

    const save = async () => {
        console.log("Save called");
        if (!id) {
            storage.get('workouts').then((workouts: Workout[]) => {
                console.log(uuidv4());
                const updatedWorkouts = [...workouts, { ...workout, id: uuidv4() }];
                storage.set('workouts', updatedWorkouts).then((result: Workout[]) => {
                    setWorkouts(result);
                });
            })
        }

        storage.get('workouts').then((workouts: Workout[]) => {
            let index = workouts.findIndex(w => w.id == workout.id);
            if (index !== -1) {
                const modifiedWorkout = { ...workouts[index], ...workout };
                const updatedWorkouts = [...workouts.slice(0, index), modifiedWorkout, ...workouts.slice(index + 1)];
                storage.set('workouts', updatedWorkouts).then((result: Workout[]) => {
                    setWorkouts(result);
                });
            }
        })
        onDismiss();
    }

    const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
        // Finish the reorder and position the item in the DOM
        setWorkout({...workout, cycle: event.detail.complete(workout.cycle)})
    
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => { cancel() }}>Cancel</IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={() => { save() }}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonItem className='ion-no-padding ion-no-margin'>
                    <IonInput value={workout?.name} onIonInput={nameChanged} label="Name" labelPlacement="stacked" placeholder="Workout name"></IonInput>
                </IonItem>
                <IonLabel>
                    <div className='ion-margin-top'>
                        <sub className='ion-margin-top'>Sets</sub>
                    </div>
                </IonLabel>
                <IonReorderGroup  disabled={false} onIonItemReorder={handleReorder}>
                    {
                        workout.cycle.map((cycle, index) => {
                            const iterations = cycle.iterations;
                            const arr = [];
                            for (let i = 0; i < iterations; i++) {
                                arr.push(
                                    <IonGrid key={i}>
                                        <IonRow className='ion-align-items-center ion-justify-content-end'>
                                            <IonCol size='6'>
                                                <IonInput onIonInput={(detail) => {
                                                    const cycleIndex = workout.cycle.findIndex(c => c.set.exercise.id == cycle.set.exercise.id);
                                                    const modifiedCycle= {...workout.cycle[cycleIndex]};
                                                    if(!detail.detail.value) return;
                                                    modifiedCycle.weight[i] = parseInt(detail.detail.value);
                                                    setWorkout({...workout, cycle: [...workout.cycle.slice(0, cycleIndex), modifiedCycle ,...workout.cycle.slice(cycleIndex+1)]})
                                                }}  fill="outline" value={cycle.weight[i]} type="number" placeholder="0"></IonInput>
                                            </IonCol>
                                            <IonCol size='6'>
                                                <IonInput onIonInput={(detail) => {
                                                    const cycleIndex = workout.cycle.findIndex(c => c.set.exercise.id == cycle.set.exercise.id);
                                                    const modifiedCycle= {...workout.cycle[cycleIndex]};
                                                    if(!detail.detail.value) return;
                                                    modifiedCycle.reps[i] = parseInt(detail.detail.value);
                                                    setWorkout({...workout, cycle: [...workout.cycle.slice(0, cycleIndex), modifiedCycle ,...workout.cycle.slice(cycleIndex+1)]})
                                                }} fill="outline" value={cycle.reps[i]} type="number" placeholder="0"></IonInput>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                )
                            }
                            return (
                                <IonCard className='ion-no-padding ion-no-margin ion-margin-top' key={index}>
                                    <IonCardHeader className='ion-no-margin'>
                                        <IonItem className='ion-no-padding ion-no-margin'>
                                            <IonReorder slot='end'></IonReorder>
                                            <IonAvatar slot='start'>
                                                <IonImg alt={cycle.set.exercise.name} src={`.\\exercises\\${cycle.set.exercise.images[1]}`} />
                                            </IonAvatar>
                                            <IonLabel className='ion-no-margin ion-text-wrap'>{cycle.set.exercise.name}</IonLabel>
                                        </IonItem>
                                    </IonCardHeader>
                                    <IonCardContent className='ion-no-padding ion-no-margin ion-padding-horizontal'>
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
                                            <IonItem>
                                                <IonButton size='default' className='ion-no-margin' slot='end' expand='block' onClick={() => {
                                                    const cycleIndex = workout.cycle.findIndex(c => c.set.exercise.id == cycle.set.exercise.id);
                                                    const modifiedCycle= {...workout.cycle[cycleIndex]};
                                                    modifiedCycle.iterations--;
                                                    modifiedCycle.reps.pop();
                                                    modifiedCycle.weight.pop();
                                                    
                                                    // Remove if iterations is reduced to 0
                                                    if(modifiedCycle.iterations < 1) return setWorkout({...workout, cycle: [...workout.cycle.slice(0, cycleIndex), ...workout.cycle.slice(cycleIndex+1)]})
                                                    
                                                    setWorkout({...workout, cycle: [...workout.cycle.slice(0, cycleIndex), modifiedCycle ,...workout.cycle.slice(cycleIndex+1)]})
                                                }} color={'danger'}>
                                                    <IonIcon icon={trashOutline}></IonIcon>
                                                </IonButton>
                                                <IonButton size='default' className='ion-margin-start ion-margin-vertical' slot='end' expand='block' onClick={() => {
                                                    const cycleIndex = workout.cycle.findIndex(c => c.set.exercise.id == cycle.set.exercise.id);
                                                    const modifiedCycle= {...workout.cycle[cycleIndex]};
                                                    modifiedCycle.reps.push(cycle.reps[iterations-1]);
                                                    modifiedCycle.weight.push(cycle.weight[iterations-1]);
                                                    modifiedCycle.iterations++;
                                                    setWorkout({...workout, cycle: [...workout.cycle.slice(0, cycleIndex), modifiedCycle ,...workout.cycle.slice(cycleIndex+1)]})
                                                }} color={'secondary'}>
                                                    <IonIcon icon={addOutline}></IonIcon>
                                                </IonButton>
                                            </IonItem>
                                        </IonList>
                                    </IonCardContent>
                                </IonCard>
                            );
                        })
                    }
                </IonReorderGroup>
                <IonButton onClick={() => { openModal() }} color={'secondary'} className='ion-margin-top' expand='block' fill='clear'>Add exercise</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default WorkoutEditModal;
