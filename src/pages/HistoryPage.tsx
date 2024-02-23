import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonPage, IonRow } from '@ionic/react';
import { useContext, useEffect } from 'react';
import { AppContext } from '../App';
import './mainpage.css';
import { barbellSharp, calendar, stopwatch } from 'ionicons/icons';

const formatTimeSpan = (timeSpanMs: number) => {
    const milliseconds = timeSpanMs % 1000;
    const seconds = Math.floor((timeSpanMs / 1000) % 60);
    const minutes = Math.floor((timeSpanMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeSpanMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeSpanMs / (1000 * 60 * 60 * 24));
    const parts = [];

    if (hours > 0) {
        parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    }

    if (seconds > 0) {
        parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    }

    return parts.join(', ');
}

const HistoryPage: React.FC = () => {
    const { historyEntries } = useContext(AppContext);
    //   const [currentId, setCurrentId] = useState<string | undefined>(undefined);

    //   const [present, dismiss] = useIonModal(WorkoutEditModal, {
    //     id: currentId,
    //     onDismiss: (data: string, role: string) => dismiss(data, role),
    //   });

    //   const openEditModal = () => {
    //     present({
    //       onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
    //         console.log(ev);
    //       },
    //     });
    //   }


    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding">
                <h1 style={{ fontWeight: '900' }} className='ion-padding-bottom'>My History!</h1>
                {
                    historyEntries.toReversed().map((historyEntry, index) => {
                        const startTime = new Date(parseInt(historyEntry.startTime));
                        const endTime = new Date(parseInt(historyEntry.endTime));

                        // Calculate the time span in milliseconds
                        const timeSpanMs = endTime.getTime() - startTime.getTime();

                        // Convert the time span to a human-readable format
                        const timeSpan = formatTimeSpan(timeSpanMs);

                        return (
                            <IonCard key={index} className="ion-no-padding ion-no-margin ion-margin-top">
                                <IonCardHeader className='ion-no-padding ion-padding-horizontal ion-padding-top'>
                                    <h1>{historyEntry.name}</h1>
                                    <IonItem className="ion-no-padding">
                                        <IonIcon slot='start' icon={calendar}></IonIcon>
                                        <IonLabel slot='end'>{new Date(parseInt(historyEntry.startTime)).toLocaleDateString()}</IonLabel>
                                    </IonItem>
                                    <IonItem className="ion-no-padding">
                                        <IonIcon slot='start' icon={stopwatch}></IonIcon>
                                        <IonLabel slot='end'>{timeSpan}</IonLabel>
                                    </IonItem>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonGrid className="ion-no-padding ion-no-margin ion-padding-bottom ion-padding-top">
                                        <IonRow className='ion-align-items-center ion-justify-content-start'>
                                            <IonCol size='8' className='ion-card-list-item ion-padding-end'>
                                                Exercise
                                            </IonCol>
                                            <IonCol size='2'>
                                              Weight
                                            </IonCol>
                                            <IonCol size='2'>
                                                Reps
                                            </IonCol>
                                        </IonRow>
                                        {
                                            historyEntry.cycles.map((cycle, index) => {
                                                const arr = [];
                                                for (let i = 0; i < cycle.sets.length; i++) {
                                                    arr.push(
                                                        <IonRow key={i} className='ion-align-items-center ion-justify-content-start'>
                                                            <IonCol size='8' className='ion-card-list-item ion-padding-end'>
                                                                {cycle.sets[i].exercise.name}
                                                            </IonCol>
                                                            <IonCol size='1'>
                                                                {cycle.sets[i].weight}
                                                            </IonCol>
                                                            <IonCol size='1'>
                                                                x
                                                            </IonCol>
                                                            <IonCol size='2'>
                                                                {cycle.sets[i].reps}
                                                            </IonCol>
                                                        </IonRow>
                                                    )
                                                }
                                                return (
                                                    <IonGrid key={index}>
                                                        {arr}
                                                    </IonGrid>
                                                )
                                            })
                                        }
                                    </IonGrid>
                                    <IonItem></IonItem>
                                </IonCardContent>
                            </IonCard>
                        )
                    })
                }
            </IonContent>
        </IonPage>
    );
};

export default HistoryPage;
