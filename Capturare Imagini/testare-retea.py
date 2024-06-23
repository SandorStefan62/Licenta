import mediapipe as mp
import cv2
import numpy as np

from keras.models import load_model

def citire_config(cale):
    config = {}
    with open(cale, 'r') as fisier:
        for linie in fisier:
            id, valoare = linie.strip().split(" = ")
            config[id] = valoare.split(', ')

    return config

def detectare_mediapipe(imagine, model):
    imagine = cv2.cvtColor(imagine, cv2.COLOR_BGR2RGB)
    rezultat = model.process(imagine)
    imagine = cv2.cvtColor(imagine, cv2.COLOR_RGB2BGR)
    return imagine, rezultat

def extrapolare_valori(rezultat):
    corp = []
    if rezultat.pose_landmarks:
        for rez in rezultat.pose_landmarks.landmark:
            aux = np.array([rez.x, rez.y, rez.z, rez.visibility])
            corp.append(aux)
        corp = np.array(corp).flatten()
    else:
        corp = np.zeros(132)

    mana_stanga = []
    if rezultat.left_hand_landmarks:
        for rez in rezultat.left_hand_landmarks.landmark:
            aux = np.array([rez.x, rez.y, rez.z])
            mana_stanga.append(aux)
        mana_stanga = np.array(mana_stanga).flatten()
    else:
        mana_stanga = np.zeros(63)

    mana_dreapta = []
    if rezultat.right_hand_landmarks:
        for rez in rezultat.right_hand_landmarks.landmark:
            aux = np.array([rez.x, rez.y, rez.z])
            mana_dreapta.append(aux)
        mana_dreapta = np.array(mana_dreapta).flatten()
    else:
        mana_dreapta = np.zeros(63)

    return np.concatenate([corp, mana_stanga, mana_dreapta])

mp_holistic = mp.solutions.holistic
capturare = cv2.VideoCapture(0)
capturare.set(3, 1920)
capturare.set(4, 1080)

config = citire_config('configurare.txt')
cuvinte = config['cuvinte']
numar_capturi = int(config['numar_capturi'][0])
lungime_captura = int(config['lungime_captura'][0])


model = load_model('cuvinte.h5')

propozitie = []
cadre = []
predictii = []
acuratete = 0.6

with mp_holistic.Holistic(min_detection_confidence = 0.6, min_tracking_confidence = 0.6) as holistic:
    while capturare.isOpened():
        ret, cadru = capturare.read()

        imagine, rezultate = detectare_mediapipe(cadru, holistic)

        puncte_cheie = extrapolare_valori(rezultate)
        cadre.insert(0, puncte_cheie)
        cadre = cadre[:60]

        if len(cadre) == 60:
            predictie = model.predict(np.expand_dims(cadre, axis=0))[0]
            # print(cuvinte[np.argmax(predictie)])
            predictii.append(np.argmax(predictie))

            if predictie[np.argmax(predictie)] > acuratete:
                if len(propozitie) > 0:
                    if cuvinte[np.argmax(predictie)] != propozitie[-1]:
                        propozitie.append(cuvinte[np.argmax(predictie)])
                else:
                    propozitie.append(cuvinte[np.argmax(predictie)])

            print(f"Prediction: {cuvinte[np.argmax(predictie)]} - Confidence: {predictie[np.argmax(predictie)]}")

        if len(propozitie) > 5:
            propozitie = propozitie[-5:]

        cv2.rectangle(imagine, (0,0), (640, 40), (245, 117, 16), -1)
        cv2.putText(imagine, ' '.join(propozitie), (3,30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

        cv2.imshow('Camera Feed', imagine)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cadru.release()
cv2.destroyAllWindows()