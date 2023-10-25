import { InputChangeEventDetail, IonAccordion, IonAccordionGroup, IonAvatar, IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonPage, IonSearchbar, IonToolbar } from '@ionic/react';
import { checkbox, closeCircle, filterOutline } from 'ionicons/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../App';
import useSearch from '../hooks/useSearch';
import { Exercise, MuscleGroup } from '../models/exercise';
import './exercisesListModal.css';

const SCROLL_STEP = 30;

interface ExerciseDetailModalProps {
    onDismiss: (data?: Exercise[], role?: string) => void;
}

const ExerciseListModal: React.FC<ExerciseDetailModalProps> = (props) => {
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | undefined>(undefined);
    const [selectedExercises, setSelectedExercises] = useState<Set<Exercise>>(new Set());
    const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
    const [list, setList] = useState<Exercise[]>([]);
    const [index, setIndex] = useState<number>(0);
    const { exercises } = useContext(AppContext);
    const { onDismiss } = props;

    const { results, searchValue, setSearchValue } = useSearch({
        dataSet: [...exercises],
        keys: ['name'],
        shouldSort: false,
    });

    useEffect(() => {
        updateList();
    }, []);

    const toggleAccordion = () => {
        if (!accordionGroup.current) {
            return;
        }
        const nativeEl = accordionGroup.current;

        if (nativeEl.value === 'filter') {
            nativeEl.value = undefined;
        } else {
            nativeEl.value = 'filter';
        }
    };

    const select = (exercise: Exercise) => {
        const modifiedSelectedExercises = new Set(selectedExercises);
        if (modifiedSelectedExercises.has(exercise)) modifiedSelectedExercises.delete(exercise);
        else modifiedSelectedExercises.add(exercise);
        setSelectedExercises(modifiedSelectedExercises);
    }

    const filter = (e: CustomEvent<InputChangeEventDetail>) => {
        if (e.detail.value != null) {
            setSearchValue(e.detail.value);
        }
    };

    const resetList = () => {
        const newList = results.slice(0, 0 + SCROLL_STEP);
        setList([...newList]);
        setIndex(0 + SCROLL_STEP);
    };

    const updateList = (scrollStep = SCROLL_STEP) => {
        const newList = results.slice(index, index + scrollStep);
        setList((prevList) => [...prevList, ...newList]);
        setIndex((prevIndex) => prevIndex + scrollStep);
    };

    const updateFilter = (mg: MuscleGroup) => {
        setMuscleGroup((prevMuscleGroup) => {
            if (prevMuscleGroup === mg) {
                resetList();
                return undefined;
            }
            updateList(900);
            return mg;
        })

    };

    const filteredExercises = (searchValue.length > 0 ? results : list).filter((exercise) => !muscleGroup || exercise.primaryMuscles[0] === muscleGroup);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => onDismiss(undefined, 'cancel')}>
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onDismiss([...selectedExercises], 'add')}>
                            Add
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonSearchbar className='ion-no-padding' value={searchValue} onIonInput={filter} animated={true} placeholder="Filter" />
                <IonButton className='ion-margin-top' expand='block' size='default' onClick={() => { toggleAccordion() }} color={'light'}>
                    <IonLabel>Muscle Grrups</IonLabel>
                    <IonIcon slot='end' icon={filterOutline}></IonIcon>
                </IonButton>
                <IonAccordionGroup ref={accordionGroup} animated={false}>
                    <IonAccordion value='filter'>
                        <div slot="content">
                            {Object.values(MuscleGroup).map((group, index) => (
                                <IonChip
                                    key={index}
                                    outline={muscleGroup !== group}
                                    color={muscleGroup === group ? 'dark' : 'medium'}
                                    onClick={() => updateFilter(group)}
                                    style={{ textTransform: 'capitalize' }}
                                >
                                    <IonLabel>{group}</IonLabel>
                                    {
                                        muscleGroup === group &&
                                        <IonIcon icon={closeCircle}></IonIcon>
                                    }
                                </IonChip>
                            ))}
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
                {
                    filteredExercises.map((exercise, index) => {
                        let isChecked = selectedExercises.has(exercise);
                        return (
                            <IonItem onClick={() => { select(exercise); }} key={index}>
                                <IonAvatar slot="start">
                                    <IonImg alt={exercise.name} src={`.\\exercises\\${exercise.images[1]}`} />
                                </IonAvatar>
                                <IonLabel >
                                    <h2 style={{ fontWeight: `${isChecked ? '900' : 'inherit'}` }}>{exercise.name}</h2>
                                    <p className='ion-text-capitalize'>{exercise.primaryMuscles.join(', ')}</p>
                                </IonLabel>
                                {
                                    isChecked &&
                                    <IonIcon icon={checkbox} color='secondary'></IonIcon>
                                }
                            </IonItem>
                        )
                    })
                }
                <IonInfiniteScroll
                    onIonInfinite={(ev) => {
                        updateList();
                        setTimeout(() => ev.target.complete(), 500);
                    }}
                >
                    <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
}

export default ExerciseListModal;
