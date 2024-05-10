import cv2
import mediapipe as mp

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
    mp_drawing.draw_landmarks(imagine, rezultat.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
                              mp_drawing.DrawingSpec(culoare_puncte_reper_fata, thickness=1, circle_radius=1),
                              mp_drawing.DrawingSpec(culoare_puncte_reper_fata, thickness=1, circle_radius=1)
                              )
    mp_drawing.draw_landmarks(imagine, rezultat.pose_landmarks,
                              mp_holistic.POSE_CONNECTIONS,
                              mp_drawing.DrawingSpec(culoare_puncte_reper_corp, thickness=1, circle_radius=1),
                              mp_drawing.DrawingSpec(culoare_puncte_reper_corp, thickness=1, circle_radius=1)
                              )
    mp_drawing.draw_landmarks(imagine, rezultat.left_hand_landmarks,
                              mp_holistic.HAND_CONNECTIONS,
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_stanga, thickness=1, circle_radius=1),
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_stanga, thickness=1, circle_radius=1)
                              )
    mp_drawing.draw_landmarks(imagine, rezultat.right_hand_landmarks,
                              mp_holistic.HAND_CONNECTIONS,
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_dreapta, thickness=1, circle_radius=1),
                              mp_drawing.DrawingSpec(culoare_puncte_reper_mana_dreapta, thickness=1, circle_radius=1)
                              )

capturare = cv2.VideoCapture(0)
capturare.set(3, 1920)
capturare.set(4, 1080)

fps = capturare.get(cv2.CAP_PROP_FPS)
print(fps)

with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    while capturare.isOpened():
        ret, cadru = capturare.read()
        imagine, rezultat = detectare_mediapipe(cadru, holistic)
        # print(rezultat)
        generare_puncte_reper(imagine, rezultat)
        cv2.imshow('OpenCV Feed', imagine)
        cv2.resizeWindow('OpenCV Feed', 1920, 1080)
        if(cv2.waitKey(10) & 0xFF == ord('q')):
            break

capturare.release()
cv2.destroyAllWindows()
