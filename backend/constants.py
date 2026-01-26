# Tipos de Utilizador
# Usamos constantes para evitar "magic strings" espalhadas pelo código.
# Se quisermos mudar "admin" para "administrator", só mudamos aqui.
USER_TYPE_REGISTERED = 'registered'
USER_TYPE_ADMIN = 'admin'
USER_TYPE_RESEARCHER = 'researcher'

# Estados de Utilizador
# Define se o utilizador pode fazer login ou não.
USER_STATUS_ACTIVE = 'active'
USER_STATUS_PENDING = 'pending'
USER_STATUS_SUSPENDED = 'suspended'

# Géneros
# Opções padrão para o perfil do utilizador.
GENDER_MALE = 'Male'
GENDER_FEMALE = 'Female'
GENDER_OTHER = 'Other'
GENDER_PREFER_NOT_TO_SAY = 'Prefer not to say'

# Estados de Simulação
# Controla o fluxo da simulação. 'running' significa que o backend ainda está a calcular.
SIM_STATUS_COMPLETE = 'complete'
SIM_STATUS_RUNNING = 'running'
SIM_STATUS_PAUSED = 'paused'
SIM_STATUS_FAILED = 'failed'
SIM_STATUS_DELETED = 'deleted'
