-- Agregar columna para almacenar los campos de cada dispositivo
ALTER TABLE dispositivos 
ADD COLUMN campos JSONB DEFAULT '[]'::jsonb;

-- Actualizar dispositivos existentes con sus campos por defecto
UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "ip", "mac", "anydesk", "tipoEquipo", 
  "ram", "disco", "office", "tipoConexion", "programaAdicional", 
  "equipamiento", "caracteristica", "sistemaOperativo"
]'::jsonb 
WHERE nombre = 'Computadora';

UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "mac", "anydesk", "tipoEquipo", 
  "ram", "disco", "office", "tipoConexion", "programaAdicional", 
  "equipamiento", "caracteristica", "sistemaOperativo"
]'::jsonb 
WHERE nombre = 'Laptop';

UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "equipamiento", "caracteristica"
]'::jsonb 
WHERE nombre = 'Mouse';

UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "tipoConexion", "equipamiento", "caracteristica"
]'::jsonb 
WHERE nombre = 'Teclado';

UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "tipoConexion", "equipamiento", "caracteristica"
]'::jsonb 
WHERE nombre = 'Monitor';

UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "ip", "tipoConexion", "equipamiento", "caracteristica"
]'::jsonb 
WHERE nombre = 'Impresora';

UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "tipoConexion", "equipamiento", "caracteristica"
]'::jsonb 
WHERE nombre = 'Scanner';

UPDATE dispositivos 
SET campos = '[
  "codigoInventario", "nombrePc", "funcionario", "estado", "marca", 
  "dependencia", "direccion", "ip", "equipamiento", "caracteristica"
]'::jsonb 
WHERE nombre = 'Telefono';
