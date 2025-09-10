-- Script para hacer campos opcionales en la tabla inventario
-- Esto permite que dispositivos como mouse, teclado, monitor no requieran IP, MAC, etc.

-- Hacer campos opcionales (permitir NULL)
ALTER TABLE inventario ALTER COLUMN direccion_ip DROP NOT NULL;
ALTER TABLE inventario ALTER COLUMN direccion_mac DROP NOT NULL;
ALTER TABLE inventario ALTER COLUMN nombre_pc DROP NOT NULL;
ALTER TABLE inventario ALTER COLUMN nombres_funcionario DROP NOT NULL;

-- Eliminar la restricción UNIQUE de algunos campos para permitir valores NULL múltiples
-- (PostgreSQL permite múltiples NULL en campos UNIQUE)
-- Estos cambios permiten flexibilidad para diferentes tipos de dispositivos

-- Verificar cambios
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'inventario' 
AND column_name IN ('direccion_ip', 'direccion_mac', 'nombre_pc', 'nombres_funcionario')
ORDER BY column_name;
