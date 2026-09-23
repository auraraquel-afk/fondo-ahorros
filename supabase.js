import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://viymyizlkrberytzqnby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeW15aXpsa3JiZXJ5dHpxbmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNzEyODUsImV4cCI6MjEwNTc0NzI4NX0.Gjv1Z-HOY-pRQmSLiHyeH6j6jxQo9bb7lhpkTx9AgnI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);