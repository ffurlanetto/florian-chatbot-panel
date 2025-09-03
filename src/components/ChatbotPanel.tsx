import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { Spinner, useTheme2 } from '@grafana/ui';
import {MarkdownMessage} from "./MarkdownMessage";
import { useChatWebSocket } from './WebSocket';

interface Props extends PanelProps {}

export const ChatbotPanel: React.FC<Props> = () => {
  const [input, setInput] = useState('');
  const theme = useTheme2();
  const { messages, sendMessage, status, loading, messagesEndRef } = useChatWebSocket("ws://localhost:8080/customer-support-agent");

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const panelStyles = {
    container: {
      height: '100%',
      display: 'flex',
      "flex-direction": 'column',
      padding: '10px',
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.text.primary,
    },
    messagesContainer: {
      flex: 1,
      "overflow-y": 'auto',
      marginBottom: '10px',
      display: 'flex',
      "flex-direction": 'column',
    },
    messageBubble: (sender: 'agent' | 'user') => ({
      maxWidth: sender === 'agent' ? '100%' : '70%',
      alignSelf: sender === 'agent' ? 'flex-start' : 'flex-end',
      backgroundColor: sender === 'agent' ? 'rgba(0, 0, 0, 0)' : theme.colors.secondary.main,
      color: sender === 'agent' ? theme.colors.secondary.text : theme.colors.secondary.contrastText,
      padding: '10px 15px',
      borderRadius: '15px',
      margin: '5px 0',
      "word-break": 'break-word',
    }),
    loader: {
      alignSelf: 'flex-start',
      margin: '5px 0',
      fontStyle: 'italic',
      color: theme.colors.text.secondary,
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    textarea: {
      flex: 1,
      minHeight: '50px',
      maxHeight: '150px',
      padding: '10px 15px',
      border: `1px solid ${theme.colors.primary.border}`,
      backgroundColor: theme.isDark ? 'rgba(43,43,43,0.8)' : 'rgba(255,255,255,0.8)',
      color: theme.colors.text.primary,
      fontSize: '14px',
      outline: 'none',
    },
    button: {
      marginLeft: '10px',
      padding: '10px 20px',
      backgroundColor: theme.colors.primary.main,
      color: theme.colors.primary.contrastText,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
    },
  };

  return (
    <div style={panelStyles.container}>
      <div style={panelStyles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div key={idx} style={panelStyles.messageBubble(msg.sender)}>
              <MarkdownMessage text={ msg.text } />
          </div>
        ))}
        {status === "connecting" && (
          <div style={{ display: "flex", justifyContent: "center", margin: "8px" }}>
            <Spinner inline={true} /> <span>Connecting...</span>
          </div>
        )}
        {loading && (
          <div style={panelStyles.loader}>
            <Spinner inline={true} /> <span>Typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={panelStyles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="Écrire un message..."
          style={panelStyles.textarea}
        />
        <button onClick={handleSend} style={panelStyles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

