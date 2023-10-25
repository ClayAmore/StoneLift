import { InputChangeEventDetail, IonAccordion, IonAccordionGroup, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonPage, IonRow, IonSearchbar, IonText, IonToolbar, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { closeCircle } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import useSearch from '../hooks/useSearch';
import ExerciseDetailModal from '../modals/ExerciseDetailModal';
import { Exercise, MuscleGroup } from '../models/exercise';
import './exercisesPage.css';

const SCROLL_STEP = 30;

const Exercises: React.FC = () => {
  const { exercises } = useContext(AppContext);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | undefined>(undefined);
  const [list, setList] = useState<Exercise[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [currentExercise, setCurrentExercise] = useState<Exercise | undefined>(undefined);
  const { results, searchValue, setSearchValue } = useSearch({
    dataSet: [...exercises],
    keys: ['name'],
    shouldSort: false,
  });

  const [present, dismiss] = useIonModal(ExerciseDetailModal, {
    exercise: currentExercise,
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });

  const openModal = () => {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
      },
    });
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

  useEffect(() => {
    updateList();
  }, []);

  const filteredExercises = (searchValue.length > 0 ? results : list).filter((exercise) => !muscleGroup || exercise.primaryMuscles[0] === muscleGroup);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonAccordionGroup expand="compact">
            <IonAccordion>
              <IonItem slot="header">
                <IonSearchbar style={{ paddingTop: '1em', paddingBottom: '1em' }} value={searchValue} onIonInput={filter} animated={true} placeholder="Filter" />
              </IonItem>
              <div className="ion-padding" slot="content">
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
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {filteredExercises.map((exercise, index) => (
            <IonItem key={index} onClick={() => { setCurrentExercise(exercise);openModal()}} className='ion-no-padding ion-no-margin'>
              <IonGrid>
                <IonRow>
                  <IonCol size="2">
                    <div style={{ backgroundColor: '#63809D', overflow: 'hidden', width: '3rem', height: '3rem' }}>
                      <IonImg style={{ mixBlendMode: 'overlay', objectFit: 'cover', objectPosition: 'center', height: '3rem', width: '3rem' }} alt={exercise.name} src={`.\\exercises\\${exercise.images[1]}`} />
                    </div>
                  </IonCol>
                  <IonCol size="10">
                    <IonGrid>
                      <IonRow>
                        <IonLabel style={{ fontWeight: '700' }}>{exercise.name}</IonLabel>
                      </IonRow>
                      <IonRow>
                        <IonText className='ion-text-capitalize'>
                          <sub style={{ fontFamily: `'Hind Siliguri', sans-serif` }}>{exercise.primaryMuscles[0]}</sub>
                        </IonText>
                      </IonRow>
                    </IonGrid>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
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
};

export default Exercises;