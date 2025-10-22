-- ========================================
-- SCRIPT COMPLETO DE CORRECCIÓN DE ZONA HORARIA
-- Ecuador: America/Guayaquil (GMT-5)
-- ========================================

-- 1. Configurar la zona horaria de la sesión y la base de datos
SET timezone = 'America/Guayaquil';
ALTER DATABASE "Inventario" SET timezone TO 'America/Guayaquil';

-- 2. Convertir la columna fecha de historial_inventario de TIMESTAMP a TIMESTAMPTZ
-- Esto hace que PostgreSQL almacene y devuelva fechas con zona horaria
ALTER TABLE historial_inventario 
    ALTER COLUMN fecha TYPE TIMESTAMPTZ 
    USING fecha AT TIME ZONE 'America/Guayaquil';

-- Cambiar el default para usar la zona horaria correcta
ALTER TABLE historial_inventario 
    ALTER COLUMN fecha SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Guayaquil');

-- 3. Convertir fecha_registro en la tabla inventario
ALTER TABLE inventario 
    ALTER COLUMN fecha_registro TYPE TIMESTAMPTZ 
    USING fecha_registro AT TIME ZONE 'America/Guayaquil';

ALTER TABLE inventario 
    ALTER COLUMN fecha_registro SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Guayaquil');

-- 4. Convertir fecha_eliminacion en la tabla inventario (si existe)
-- Primero verificar si la columna existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='inventario' 
        AND column_name='fecha_eliminacion'
    ) THEN
        ALTER TABLE inventario 
            ALTER COLUMN fecha_eliminacion TYPE TIMESTAMPTZ 
            USING CASE 
                WHEN fecha_eliminacion IS NOT NULL 
                THEN fecha_eliminacion AT TIME ZONE 'America/Guayaquil'
                ELSE NULL
            END;
    END IF;
END $$;

-- 5. Convertir fecha_cambio_password en la tabla usuario (si existe)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='usuario' 
        AND column_name='fecha_cambio_password'
    ) THEN
        ALTER TABLE usuario 
            ALTER COLUMN fecha_cambio_password TYPE TIMESTAMPTZ 
            USING CASE 
                WHEN fecha_cambio_password IS NOT NULL 
                THEN fecha_cambio_password AT TIME ZONE 'America/Guayaquil'
                ELSE NULL
            END;
    END IF;
END $$;

-- 6. Verificar que todas las conversiones se hicieron correctamente
SELECT 
    table_name, 
    column_name, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND data_type LIKE '%timestamp%'
    AND table_name IN ('historial_inventario', 'inventario', 'usuario')
ORDER BY table_name, column_name;

-- 7. Verificar la configuración de timezone
SHOW timezone;

-- 8. Mostrar algunas fechas de ejemplo para verificar
SELECT 
    'historial_inventario' as tabla,
    COUNT(*) as registros,
    MIN(fecha) as fecha_mas_antigua,
    MAX(fecha) as fecha_mas_reciente,
    NOW() as hora_actual_servidor
FROM historial_inventario
UNION ALL
SELECT 
    'inventario' as tabla,
    COUNT(*) as registros,
    MIN(fecha_registro) as fecha_mas_antigua,
    MAX(fecha_registro) as fecha_mas_reciente,
    NOW() as hora_actual_servidor
FROM inventario;

-- 9. Mostrar información sobre la zona horaria actual
SELECT 
    'Configuración de Zona Horaria' as info,
    current_setting('TIMEZONE') as zona_horaria,
    NOW() as hora_con_tz,
    NOW()::timestamp as hora_sin_tz,
    EXTRACT(TIMEZONE FROM NOW())/3600 as utc_offset_horas;

COMMIT;
