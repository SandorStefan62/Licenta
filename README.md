# Licenta -- SignaCom
SignaCom este o aplicație cu rol de platformă educativă pentru a promova și ușura procesul de învățare a limbajului mimico-gestual al limbii române.

## Instrucțiuni de utilizare:

Pentru a copia fișierele local, utilizați comanda **git clone _urlCatreAcestRepo_**

### Colectare Imagini:
Pentru a putea rula scripturile necesare pentru crearea, antrenarea și testarea corectă a unei noi rețele neuronale, aveți nevoie să configurați un mediu separat pentru TensorFlow. (De remarcat: dacă doriți integrarea suportului cu GPU, aveți nevoie de un GPU marca Nvidia)

**Linux:**
1) Instalați driverul pentru placa video prin comanda: **nvidia_smi**
2) Asigurați-vă că aveți ultima versiune de *pip* instalată prin comanda: **pip install --upgrade pip**
3) Instalați TensorFlow utilizând comanda: 
    Pentru utilizatori care au GPU:
        **pip install tensorflow[and-cuda]**
    Pentru utilizatori care nu au GPU:
        **pip install tensorflow**
4) Verificați instalarea:
    Verificați CPU:
        **python3 -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"**
    Verificați GPU:
        **python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"**

**MacOS:**
1) Asigurați-vă că aveți ultima versiune de *pip* instalată prin comanda: **pip install --upgrade pip**
2) Instalați TensorFlow utilizând comanda: **pip install tensorflow**
3) Verificați instalarea prin comanda: **python3 -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"**

**Windows (nativ):**
1) Instalați [*Anaconda*](https://www.anaconda.com/download/success) pentru a configura mediul TensorFlow
2) Creați un mediu conda prin _Anaconda Prompt_ rulând următoarele comenzi:
```
conda create --name *nume* python=3.9
conda deactivate
conda activate *nume*
```
3) Instalați CUDA și cuDNN prin _Anaconda Prompt_: **conda install -c conda-forge cudatoolkit=11.2 cudnn=8.1.0**
4) Asigurați-vă că aveți ultima versiune de pip instalată: **pip install --upgrade pip**
5) Instalați TensorFlow: **pip install "tensorflow<2.11"**
6) Verificați instalarea:
    Verificați CPU:
        **python -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"**
    Verificați GPU:
        **python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"**

După ce ați reușit să configurați mediul cu succes, deschideți editorul de text folosit de dumneavoastră prin intermediul aplicației _Anaconda Navigator_.

Dacă doriți să antrenați o nouă rețea neuronală bazată pe un alt set de date, trebuie să urmați pașii următori:
1) Navigați către directorul **Colectare Imagini** prin comanda **cd '.\Capturare Imagini\'**
2) Modificați variabilele aflate în fișierul **configurare.txt**, unde:
    - cuvinte este un șir de denumiri de cuvinte despărțite prin _, _. Exemplu: **cuvinte = da, nu, eu, multumesc, salut, la revedere**
    - numar_capturi reprezintă numărul de viedoclipuri înregistrate pentru fiecare cuvânt
    - lungime_captura reprezintă numărul de cadre procesate pentru fiecare videoclip
3) Pentru a crea un nou set de date rulați scriptul _capturare.py_ prin comanda **python capturare.py**

Din momentul în care scriptul _capturare.py_ incepe să ruleze, trebuie să mimați gesticulația cuvântului redat în partea de stânga sus al ecranului. Dacă doriți să întrerupeți procesul de generare a setului de date, țineți apăsat tasta _q_ până ce programul se va închide.

4) Pentru antrenarea noii rețele cu noul set de date, rulați scriptul _retea-neuronala.py_ prin comanda **python retea-neuronala.py** (De remarcat: procesul de antrenare constă în configurarea continuă a hiperparametrilor arhitecturii din rețea, deci, dacă rezultatele nu sunt pe măsura așteptărilor, editați hiperparametrii)
5) Pentru testarea noii rețele, rulați scriptul _testare-retea.py_ prin comanda **python testare-retea.py**

Pentru a putea fi folosită de aplicația web din cadrul directorului _detectare-limbaj-semne_, modelul salvat trebuie convertit într-un model de tip _.json_. Pentru a realiza acest lucru, dacă sunteți pe un sistem de operare Windows, aveți nevoie să configurați un mediu WSL pentru ca rularea comenzii de convertire să funcționeze corect. Odată ce ați reușit, rulați comanda **$ tensorflowjs_converter --input_format=keras /tmp/model.h5 /tmp/tfjs_model** pentru a converti modelul. După ce ați convertit cu succes modelul, mutați fișierele prin drag-and-drop în directorul '.\detectare-limbaj-semne\public\'.

### API și Aplicație web

Pentru rularea API-ului și a aplicației web în mod local veți avea nevoie să vă creați un proiect pe [Firebase](https://firebase.google.com/), cu următoarele servicii: Firestore, Storage și Authentication. Pentru a popula variabilele de mediu aflate în fișierele _.env.dist_ [urmați acesti pași](https://stackoverflow.com/questions/52500573/where-can-i-find-my-firebase-apikey-and-authdomain).

API-ul din back-end este încărcat în mediul cloud. Pentru rularea acestuia în mediul local, utilizați comanda **firebase serve --only functions**, aceasta generează un url localhost în consolă pe care îl veți folosi pentru a înlocui url-urile folosite în aplicația web pentru a accesa API-ul.

Pentru a rula aplicația web în mediul local, prima oară rulați comanda **npm install** pentru ca npm sa instaleze toate dependințele necesare ca aplicația web să funcționeze. Populați fișierul .env.dist cu valorile luate din Firebase. După care, rulați comanda **npm run dev** pentru a porni aplicația.
