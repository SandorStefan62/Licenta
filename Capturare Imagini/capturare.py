import os
import cv2
import mediapipe as mp
import numpy as np


def citire_config(cale):
    config = {}
    with open(cale, 'r') as fisier:
        for linie in fisier:
            id, valoare = linie.strip().split(" = ")
            config[id] = valoare.split(', ')

    return config

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

#model holistic si unelte pentru desenarea modelului
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils 

def detectare_mediapipe(imagine, model):
    imagine = cv2.cvtColor(imagine, cv2.COLOR_BGR2RGB)
    rezultat = model.process(imagine)
    imagine = cv2.cvtColor(imagine, cv2.COLOR_RGB2BGR)
    return imagine, rezultat


culoare_puncte_reper_fata = (255,255,0)
culoare_puncte_reper_corp = (0, 234, 255)
culoare_puncte_reper_mana_stanga = (0, 252, 124)
culoare_puncte_reper_mana_dreapta = (43, 75, 238)

#functie care genereaza si afiseaza harta topografica a fetei si mainilor
def generare_puncte_reper(imagine, rezultat):
    
    mp_drawing.draw_landmarks(imagine, rezultat.pose_landmarks,
                              mp_holistic.POSE_CONNECTIONS,
                              mp_drawing.DrawingSpec(culoare_puncte_reper_corp, thickness = 1, circle_radius = 1),
                              mp_drawing.DrawingSpec(culoare_puncte_reper_corp, thickness = 1, circle_radius = 1)
                              )
    
    mp_drawing.draw_landmarks(imagine, rezultat.left_hand_landmarks,
                              mp_holistic.HAND_CONNECTIONS,
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_stanga, thickness = 1, circle_radius = 1),
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_stanga, thickness = 1, circle_radius = 1)
                              )
    
    mp_drawing.draw_landmarks(imagine, rezultat.right_hand_landmarks,
                              mp_holistic.HAND_CONNECTIONS,
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_dreapta, thickness = 1, circle_radius = 1),
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_dreapta, thickness = 1, circle_radius = 1)
                              )

capturare = cv2.VideoCapture(0)
capturare.set(3, 1920)
capturare.set(4, 1080)

DATA_PATH = os.path.join('dataset')

config = citire_config('configurare.txt')
cuvinte = config['cuvinte']
numar_capturi = int(config['numar_capturi'][0])
lungime_captura = int(config['lungime_captura'][0])

# print(f"{cuvinte} {numar_capturi} {lungime_captura}")

for cuvant in cuvinte:
    for captura in range(numar_capturi):
        try:
            os.makedirs(os.path.join(DATA_PATH, cuvant, str(captura)))
        except:
            pass

with mp_holistic.Holistic(min_detection_confidence=0.6, min_tracking_confidence=0.6) as holistic:
    for cuvant in cuvinte:
        for captura in range(numar_capturi):
            for numar_cadru in range(lungime_captura):
                print(numar_cadru)

                ret, cadru = capturare.read()

                imagine, rezultat = detectare_mediapipe(cadru, holistic)

                generare_puncte_reper(imagine, rezultat)

                if numar_cadru == 0:
                    cv2.putText(imagine, "PORNIRE COLECTARE VIDEOCLIPURI", (120, 200),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 4, cv2.LINE_AA)
                    cv2.putText(imagine, 'Colectare cadre pentru {}, numar videoclip {}'.format(cuvant, captura), (15, 12),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                    cv2.waitKey(2000)
                else:
                    cv2.putText(imagine, 'Colectare cadre pentru {}, numarul videoclipului {}'.format(cuvant, captura), (15,12),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                    
                valori_cheie = extrapolare_valori(rezultat)
                cale_fisier = os.path.join(DATA_PATH, cuvant, str(captura), str(numar_cadru))
                np.save(cale_fisier, valori_cheie)

                cv2.imshow('OpenCV Feed', imagine)
                cv2.resizeWindow('OpenCV Feed', 1920, 1080)

                if(cv2.waitKey(10) & 0xFF == ord('q')):
                    break

capturare.release()
cv2.destroyAllWindows()
