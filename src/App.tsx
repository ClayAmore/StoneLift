import {
  IonApp,
  IonContent,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Drivers, Storage } from '@ionic/storage';
import { createContext, useEffect, useState } from "react";
import { Redirect, Route } from 'react-router-dom';
import exercisesJSON from './models/exercises.json';
import Exercises from './pages/ExercisesPage';
import MainPage from './pages/MainPage';

import { barbell, home, time } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import { } from 'react';
import { Exercise } from './models/exercise';
import { WorkoutHistoryEntry } from './models/history';
import { Workout } from './models/workout';
import HistoryPage from './pages/HistoryPage';
import './theme/variables.css';

setupIonicReact();

interface IAppContext {
  storage: Storage,
  exercises: readonly Exercise[],
  workouts: readonly Workout[],
  historyEntries: readonly WorkoutHistoryEntry[],
  setExercises: (exercises: Exercise[]) => void,
  setWorkouts: (workouts: Workout[]) => void,
  setHistoryEntries: (historyEntries: WorkoutHistoryEntry[]) => void
}

const storage = new Storage({
  name: '__mydb',
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

export let AppContext = createContext<IAppContext>({
  storage: storage,
  exercises: [],
  workouts: [],
  historyEntries: [],
  setExercises: () => { },
  setWorkouts: () => { },
  setHistoryEntries: () => { }
});

const App: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [historyEntries, setHistoryEntries] = useState<WorkoutHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupStore = async () => {
      await storage.create();

      const exercisesResult: Exercise[] = await storage.get("exercises") ?? [];
      const workoutsResult: Workout[] = await storage.get("workouts") ?? [];
      const historyEntriesResult: WorkoutHistoryEntry[] = await storage.get("historyEntries") ?? [];

      if (exercisesResult.length < 1) await storage.set("exercises", exercisesJSON);
      if (workoutsResult.length < 1) storage.set("workouts", []);
      if (historyEntriesResult.length < 1) storage.set("historyEntries", []);

      setExercises(await storage.get("exercises"));
      setWorkouts(await storage.get("workouts"));
      setHistoryEntries(await storage.get("historyEntries"));
    }
    setupStore().then(() => {
      setIsLoading(false);
    });
  }, [])

  if (isLoading) return (
    <IonApp>
      <IonContent fullscreen>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IonSpinner></IonSpinner>
        </div>
      </IonContent>
    </IonApp>
  );

  return (
    <AppContext.Provider value={{ storage, exercises, workouts, historyEntries, setWorkouts, setExercises, setHistoryEntries }}>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home" component={MainPage} />
              <Route exact path="/history" component={HistoryPage} />
              <Route exact path="/exercises" component={Exercises} />
              <Redirect exact path="/" to='/home' />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>

              <IonTabButton tab="history" href="/history">
                <IonIcon icon={time} />
                <IonLabel>History</IonLabel>
              </IonTabButton>

              <IonTabButton tab="exercises" href="/exercises">
                <IonIcon icon={barbell} />
                <IonLabel>Exercises</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </AppContext.Provider>
  );
}

export default App;
