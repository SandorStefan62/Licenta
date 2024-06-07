import os
import time
import numpy as np

from sklearn.model_selection import train_test_split
from keras.utils import to_categorical

from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout, BatchNormalization, Bidirectional
from keras.callbacks import TensorBoard
from keras.optimizers import Adam

def citire_config(cale):
    config = {}
    with open(cale, 'r') as fisier:
        for linie in fisier:
            id, valoare = linie.strip().split(" = ")
            config[id] = valoare.split(', ')

    return config

config = citire_config('configurare.txt')
cuvinte_extrase = config['cuvinte']
numar_capturi = int(config['numar_capturi'][0])
lungime_captura = int(config['lungime_captura'][0])

cuvinte = np.array(cuvinte_extrase)
print(cuvinte)

capturi, etichete = [], []
vector_etichete = {eticheta: num for num, eticheta in enumerate(cuvinte)}
print(vector_etichete)

DATA_PATH = os.path.join("dataset")

for cuvant in cuvinte:
    for captura in range(numar_capturi):
        cadru = []
        for numar_cadru in range(lungime_captura):
            rezultat = np.load(os.path.join(DATA_PATH, cuvant, str(captura), "{}.npy".format(numar_cadru)))
            cadru.append(rezultat)
        capturi.append(cadru)
        etichete.append(vector_etichete[cuvant])

x = np.array(capturi)
y = to_categorical(etichete).astype(int)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.05)

print("Verificare daca exista valori nule (NaN) in dataset...")
print(f"Valori NaN in vectorul x_train: {np.isnan(x_train).sum()}, in vectorul x_test: {np.isnan(x_test).sum()}")
print(f"Valori NaN in vectorul y_train: {np.isnan(y_train).sum()}, in vectorul y_test: {np.isnan(y_test).sum()}")


logs_dir = os.path.join('logs', 'run_{}'.format(time.strftime("%Y-%m-%d_%H-%M-%S")))
tb_callback = TensorBoard(log_dir=logs_dir)

optimizer = Adam(learning_rate=0.0001, epsilon=1.0)

model = Sequential()
model.add(Bidirectional(LSTM(64, return_sequences=True, activation='relu', input_shape=(60, 1662))))
model.add(Bidirectional(LSTM(128, return_sequences=True, activation='relu')))
model.add(Bidirectional(LSTM(64, return_sequences=False, activation='relu')))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(BatchNormalization())
model.add(Dense(32, activation='relu'))
model.add(Dropout(0.5))
model.add(BatchNormalization())
model.add(Dense(cuvinte.shape[0], activation='softmax'))

model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['categorical_accuracy'])
model.fit(x_train, y_train, epochs=2000, callbacks=[tb_callback])

model.save('cuvinte.h5')