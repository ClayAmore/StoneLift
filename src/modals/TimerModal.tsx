import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonPage, IonRow } from '@ionic/react';
import { watch } from 'ionicons/icons';
import { useEffect, useState } from 'react';

interface TimerModalProps {
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

const TimerModal: React.FC<TimerModalProps> = (props) => {
    const { onDismiss } = props;
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (seconds <= 0) {
            onDismiss()
            return;
        }

        const interval = setInterval(() => {
            setSeconds(seconds - 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, [seconds]);

    useEffect(() => {

    })

    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding ion-justify-content-center ion-align-content-center">
                <div style={{display: 'flex', justifyContent: 'center', alignItems:'center', height:'100%'}}>
                    <IonCol className='ion-text-center'>
                        <div style={{fontSize:'2rem'}}>{`${seconds} seconds`}</div>
                    </IonCol>
                </div>
            </IonContent>
            <IonFooter className='ion-padding'>
                <IonButton size='large' onClick={() => {onDismiss()}} expand='block' color={'danger'}>Skip Rest</IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default TimerModal;
