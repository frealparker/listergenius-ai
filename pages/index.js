import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [cost, setCost] = useState('');
  const [profit, setProfit] = useState('');
  const [price, setPrice] = useState('');
  const [platform, setPlatform] = useState('depop');
  const [discount, setDiscount] = useState('');

  const platformFees = {
    depop: 0.10,
    ebay: 0.13,
    none: 0,
  };

  const handleGenerate = async () => {
    try {
      const res = await axios.post('/api/generate', { prompt: input });
      setOutput(res.data.listing);
    } catch (err) {
      setOutput("Error generating listing. Make sure your API key is set in Vercel.");
    }
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
    const discountDecimal = parseFloat(discount) / 100 || 0;
    const platformFee = platformFees[platform] || 0;

    if (!isNaN(itemCost) && !isNaN(desiredProfit)) {
      const priceBeforeFees = itemCost + desiredProfit;
      const totalFees = priceBeforeFees * (platformFee + discountDecimal);
      const finalPrice = (priceBeforeFees + totalFees).toFixed(2);
      setPrice(`$${finalPrice}`);
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
        type="number"
        placeholder="Profit Goal"
        value={profit}
        onChange={(e) => setProfit(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <input
        type="number"
        placeholder="Discount % (optional)"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ marginRight: '1rem' }}>
        <option value="depop">Depop</option>
        <option value="ebay">eBay</option>
        <option value="none">Other / No Fees</option>
      </select>
      <button onClick={handlePricing}>Calculate Price</button>

      <div style={{ marginTop: '1rem' }}>{price && `Recommended Price: ${price}`}</div>
    </div>
  );
}
