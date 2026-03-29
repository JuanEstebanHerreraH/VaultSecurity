const { parentPort, workerData } = require('worker_threads');
const crypto = require('crypto');

/**
 * crypto-worker.js — Motor de cifrado robusto para VaultSecurity
 * Maneja operaciones pesadas de AES-256 fuera del hilo principal de Electron
 * para evitar congelamientos de la interfaz de usuario.
 */

async function run() {
    const { operation, dataString, masterPassword, answer } = workerData;

    try {
        if (operation === 'encrypt') {
            // Cifrado AES-256-CBC con PBKDF2
            const salt = crypto.randomBytes(16);
            const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256');
            const iv = crypto.randomBytes(16);
            
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(dataString, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            // Estructura: salt:iv:ciphertext
            const payload = salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
            parentPort.postMessage({ success: true, payload });

        } else if (operation === 'decrypt') {
            const parts = dataString.split(':');
            if (parts.length !== 3) {
                // Fallback para archivos antiguos o si el sistema cambió de formato
                throw new Error('Formato de base de datos no reconocido.');
            }
            
            const salt = Buffer.from(parts[0], 'hex');
            const iv = Buffer.from(parts[1], 'hex');
            const encryptedText = parts[2];
            
            const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256');
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            parentPort.postMessage({ success: true, data: decrypted });

        } else if (operation === 'decrypt-recovery') {
            // Manejador de recuperación (Respuesta a pregunta secreta)
            // En este caso, simplemente enviamos los datos procesados
            // o implementamos una lógica de validación basada en la respuesta.
            // Para VaultSecurity 1.2.x, tratamos los datos como JSON directamente.
            parentPort.postMessage({ success: true, data: dataString });
        }

    } catch (error) {
        parentPort.postMessage({ 
            success: false, 
            error: error.message || 'Error desconocido en el motor de cifrado.'
        });
    }
}

run();
