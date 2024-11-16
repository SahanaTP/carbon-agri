# -*- coding: utf-8 -*-

import pandas as pd

Oklahoma = pd.read_csv('Oklahoma.csv')
Missouri_ASP = pd.read_csv('Missouri_ASP.csv')
Missouri_BAU = pd.read_csv('Missouri_BAU.csv')
Nebraska_I_M = pd.read_csv('Nebraska_I_M.csv')
Nebraska_I_M_S = pd.read_csv('Nebraska_I_M_S.csv')
Nebraska_R_M_S = pd.read_csv('Nebraska_R_M_S.csv')


Oklahoma['Farm'] = 'Oklahoma'
Missouri_ASP['Farm'] = 'Missouri_ASP'
Missouri_BAU['Farm'] = 'Missouri_BAU'
Nebraska_I_M['Farm'] = 'Nebraska_I_M'
Nebraska_I_M_S['Farm'] = 'Nebraska_I_M_S'
Nebraska_R_M_S['Farm'] = 'Nebraska_R_M_S'

frames = [Oklahoma, Missouri_ASP, Missouri_BAU, Nebraska_I_M, Nebraska_I_M_S, Nebraska_R_M_S]
Farm_data = pd.concat(frames)

Farm_data.fillna(0.0, inplace=True)

Farm_data.rename(columns={'.geo': 'geo'}, inplace=True)

Farm_data.columns = Farm_data.columns.str.replace(' ', '')

Farm_data.to_csv('Farm_data.csv')
