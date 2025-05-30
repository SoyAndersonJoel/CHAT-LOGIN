import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://dloxxwoeicywcjwzmoio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsb3h4d29laWN5d2Nqd3ptb2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTk3MDgsImV4cCI6MjA2NDAzNTcwOH0.T6zbub3ZTm6NdjIm_600R_7cStSo0mKJwogaEz9GzBY';
export const supabase = createClient(supabaseUrl, supabaseKey );