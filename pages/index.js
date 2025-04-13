import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [cost, setCost] = useState('');
  const [profit, setProfit] = useState('');
  const [price, setPrice] = useState('');

  const handleGenerate = async () => {
    const res = await axios.post('/api/generate', { prompt: input });
    setOutput(res.data.listing);
  };

  const handleCSVDownload = () => {
    const csvContent = `Product,Listing\n"${input.replace(/"/g, '""')}","${output.replace(/"/g, '""')}"`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'listing.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePricing = () => {
    const itemCost = parseFloat(cost);
    const desiredProfit = parseFloat(profit);
    if (!isNaN(itemCost) && !isNaN(desiredProfit)) {
      const calculatedPrice = (itemCost + desiredProfit).toFixed(2);
      setPrice(`$${calculatedPrice}`);
    } else {
      setPrice('Invalid input');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>ListGenius AI - Depop/eBay Listing Generator</h1>
      <textarea
        rows={5}
        cols={80}
        placeholder="Describe your product (e.g., Y2K pink hoodie, coquette aesthetic)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '1rem', marginBottom: '1rem' }}
      />
      <br />
      <button onClick={handleGenerate} style={{ marginBottom: '1rem' }}>Generate Listing</button>

      {output && (
        <>
          <div style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '1rem' }}>{output}</div>
          <button onClick={handleCSVDownload} style={{ marginTop: '1rem' }}>Download as CSV</button>
        </>
      )}

      <h2 style={{ marginTop: '2rem' }}>Pricing Calculator</h2>
      <input
        type="number"
        placeholder="Product Cost"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <input
        type="number
