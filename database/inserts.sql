INSERT INTO SEGURO (NOMBRE, ESTADO_ACTIVO) VALUES
('Seguro Vida', TRUE),
('Seguro Salud', TRUE);

INSERT INTO USUARIO (EMAIL, TIPO) VALUES
('admin@example.com', 'Administrador'),
('doctor1@example.com', 'Doctor');

INSERT INTO SESION (TOKEN, CREATED, EMAIL) VALUES
('token1234', NOW(), 'admin@example.com'),
('token2345', NOW(), 'doctor1@example.com');

INSERT INTO PACIENTE (
    CUI,
    CORREO,
    ES_MUJER,
    NOMBRES,
    APELLIDOS,
    NOMBRE_CONTACTO1,
    PARENTESCO_CONTACTO1,
    TELEFONO_CONTACTO1,
    NOMBRE_CONTACTO2,
    PARENTESCO_CONTACTO2,
    TELEFONO_CONTACTO2,
    TIPO_SANGRE,
    DIRECCION,
    ID_SEGURO,
    FECHA_NACIMIENTO,
    TELEFONO
) VALUES
(
    '1234567890123',
    'juan.perez@example.com',
    TRUE,
    'Juan',
    'Pérez',
    'Maria Pérez',
    'Madre',
    '987654321',
    'Jose Pérez',
    'Padre',
    '987650123',
    'O+',
    'Calle Falsa 123, Ciudad',
    1,
    '1990-01-01',
    '1234567890'
),
(
    '2345678901234',
    'maria.lopez@example.com',
    FALSE,
    'María',
    'López',
    'Ana López',
    'Hermana',
    '876543219',
    'Carlos López',
    'Hermano',
    '876540123',
    'A-',
    'Avenida Siempre Viva 456, Ciudad',
    2,
    '1992-02-02',
    '2345678901'
);

INSERT INTO CONSULTA (
    ID_PACIENTE,
    FECHA,
    MOTIVO,
    FRECUENCIA_RESPIRATORIA,
    TEMPERATURA,
    SATURACION_OXIGENO,
    GLUCOMETRIA,
    FRECUENCIA_CARDIACA,
    PRESION_SISTOLICA,
    PRESION_DIASTOLICA,
    EVALUADOR
) VALUES
(
    1,
    NOW(),
    'Chequeo anual',
    '16',
    36.5,
    98.5,
    5.6,
    70,
    120,
    80,
    'Dr. Ana Torres'
),
(
    2,
    NOW() - interval '2 days',
    'Consulta de seguimiento',
    '18',
    37.2,
    97.5,
    4.8,
    75,
    130,
    85,
    'Dr. Carlos Jimenez'
);

INSERT INTO DIAGNOSTICO (ID_CONSULTA, NOMBRE, TRATAMIENTO) VALUES
(1, 'Hipertensión leve', 'Medicación antihipertensiva'),
(2, 'Diabetes tipo 2 controlada', 'Ajuste de dosis de insulina');

INSERT INTO MEDICAMENTO (NOMBRE, CANTIDAD, ID_CONSULTA) VALUES
('Metformina', 30, 2),
('Lisinopril', 30, 1);

INSERT INTO ESTUDIANTE (CARNET, CARRERA, ID_PACIENTE) VALUES
('A01234567', 'Ingeniería', 1),
('B07654321', 'Medicina', 2);

INSERT INTO COLABORADOR (CODIGO, AREA, ID_PACIENTE) VALUES
('C001', 'Administración', 1),
('C002', 'Soporte técnico', 2);
