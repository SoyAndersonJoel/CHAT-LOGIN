import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonContent } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { supabase } from 'src/app/supabase.client';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) content!: IonContent; // Corregido
  messages: any[] = [];
  newMessage = '';
  email = '';
  userId = '';
  channel: any;

  constructor(private router: Router) {}

  async ngOnInit() {
    const { data, error } = await supabase.auth.getUser();
    if (!data.user || error) {
      this.router.navigate(['/auth']);
      return;
    }

    this.email = data.user.email ?? '';
    this.userId = data.user.id;

    await this.loadMessages();
    this.listenToNewMessages();
  }

  async loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) {
      this.messages = data;
    }
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    const { data, error } = await supabase.from('messages').insert({
      content: this.newMessage,
      email: this.email,
      user_id: this.userId,
    }).select(); 

    if (error) {
      console.error('Error al enviar mensaje:', error.message);
      return;
    }
    this.newMessage = '';
    setTimeout(() => {
      this.scrollToBottom();
    }, 100); // Espera un poco para que el DOM se actualice
  }
  
  scrollToBottom() {
    this.content.scrollToBottom(500); // Desplazamiento suave en 300ms
  }

  listenToNewMessages() {
    this.channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          this.messages.push(payload.new);
        }
      )
      .subscribe();
  }

  ngOnDestroy() {
    supabase.removeChannel(this.channel);
  }
}