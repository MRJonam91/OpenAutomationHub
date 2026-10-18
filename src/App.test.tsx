import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

describe('catalog app', () => {
  it('filters workflows by search and category and shows the selected detail', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Workflow pronti da usare' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Telegram' }));
    expect(screen.getByRole('button', { name: /Release GitHub su Telegram/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Chat AI locale con Ollama/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Release GitHub su Telegram/ }));
    expect(screen.getByRole('heading', { name: 'Release GitHub su Telegram' })).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: 'Cerca workflow' }), 'nessun risultato');
    expect(screen.getByText('Nessun workflow trovato.')).toBeInTheDocument();
  });

  it('opens installation guidance for the selected workflow', async () => {
    const user = userEvent.setup();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Installa questo workflow' }));
    expect(screen.getByRole('heading', { name: "Guida all'importazione" })).toBeInTheDocument();
    expect(screen.getByText(/Importa workflow.json/)).toBeInTheDocument();
    click.mockRestore();
    vi.unstubAllGlobals();
  });

  it('validates a file locally and reports malformed JSON', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Valida un file' }));
    const input = screen.getByLabelText('File JSON del workflow');
    await user.upload(input, new File(['{broken'], 'bad.json', { type: 'application/json' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Il file non contiene JSON valido.');
  });
});
