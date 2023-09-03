import { useEffect, useState } from "react";
import "./App.css";

// currency formatter
import CurrencyFormat from "react-currency-format";
import { ToWords } from "to-words";

// chart.js
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

function App() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualStepUp, setAnnualStepUp] = useState(5);
  const [years, setYears] = useState(5);
  const [interestRate, setInterestRate] = useState(7);
  const [compoundFrequency, setCompoundFrequency] = useState(5);
  const [inflationRate, setInflationRate] = useState(4.5);

  const [futureValue, setFutureValue] = useState(0);
  const [totalPrincipal, setTotalPrincipal] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [inflationAdjustedValue, setInflationAdjustedValue] = useState(0);

  const calculate = () => {
    setTotalPrincipal(
      Number(initialInvestment) + monthlyInvestment * 12 * years
    );
    setTotalContributions(monthlyInvestment * 12 * years);

    // Convert interestRate to monthly rate and adjust for inflation if needed
    const monthlyReturnRate = (1 + interestRate / 100) ** (1 / 12) - 1;

    // Calculate future value
    let futureVal = Number(initialInvestment);
    let futureValInflationAdjusted = Number(initialInvestment);
    let monthlyContri = monthlyInvestment;

    futureVal += futureVal * (1 + interestRate / 100) ** years;

    for (let month = 1; month <= years * 12; month++) {
      if (month % 12 === 0 && Number(annualStepUp) > 0) {
        // Apply step-up percentage annually
        monthlyContri *= 1 + Number(annualStepUp) / 100;
      }

      futureVal += monthlyContri * (1 + monthlyReturnRate) ** month;
      futureValInflationAdjusted =
        futureVal * (1 - inflationRate / 100) ** years;

      setFutureValue(futureVal);
      setInflationAdjustedValue(futureValInflationAdjusted);
    }
  };

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });

  useEffect(() => {
    calculate();
    setTotalInterest(futureValue - totalPrincipal);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [futureValue]);

  // chart config
  const data = {
    labels: ["Initial Investment", "Contributions", "Interest"],
    datasets: [
      {
        label: "₹",
        data: [totalPrincipal, totalContributions, totalInterest], // Values for each segment
        backgroundColor: ["lightblue", "lightgreen", "red"], // Colors for each segment
      },
    ],
  };

  const options = {
    tooltips: {
      enabled: true,
    },
    title: {
      display: true,
      text: "My Doughnut Chart",
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <div className="App">
      <header className="App__header">
        <h1>Investments Calculator 🤑</h1>
      </header>

      <body className="App__body">
        <div className="App__inputs">
          <div className="App__input">
            <label htmlFor="initial-investment">Initial Investment (₹)</label>
            <input
              onChange={(e) => setInitialInvestment(e.target.value)}
              value={initialInvestment}
              type="number"
              id="initial-investment"
            />
          </div>

          <div className="App__input">
            <label htmlFor="monthly-investment">Monthly Investment (₹)</label>
            <input
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              value={monthlyInvestment}
              type="number"
              id="monthly-investment"
            />
          </div>

          <div className="App__input">
            <label htmlFor="annual-stepup">Annual Step-up (%)</label>
            <input
              onChange={(e) => setAnnualStepUp(e.target.value)}
              value={annualStepUp}
              type="number"
              id="annual-stepup"
            />
          </div>

          <div className="App__input">
            <label htmlFor="years">Years</label>
            <input
              onChange={(e) => setYears(e.target.value)}
              value={years}
              type="number"
              id="years"
            />
          </div>

          <div className="App__input">
            <label htmlFor="interest-rate">Interest Rate (%)</label>
            <input
              onChange={(e) => setInterestRate(e.target.value)}
              value={interestRate}
              type="number"
              id="interest-rate"
            />
          </div>

          <div className="App__input">
            <label htmlFor="compound-frequency">Compound Frequency</label>
            <select
              onChange={(e) => setCompoundFrequency(e.target.value)}
              value={compoundFrequency}
              id="compound-frequency"
            >
              <option value="1">Daily</option>
              <option value="2">Weekly</option>
              <option value="3">Monthly</option>
              <option value="4">Quarterly</option>
              <option value="5">Yearly</option>
            </select>
          </div>

          <div className="App__input">
            <label htmlFor="inflation-rate">Inflation Rate (%)</label>
            <input
              onChange={(e) => setInflationRate(e.target.value)}
              value={inflationRate}
              type="number"
              id="inflation-rate"
            />
          </div>

          <div className="App__input">
            <button onClick={calculate} id="calculate" type="submit">
              Submit
            </button>
          </div>
        </div>

        <div className="App__results">
          <div className="App__title">
            <h2>Results</h2>
          </div>

          <div className="App__result">
            <label htmlFor="future-value" className="bold">
              Future Value
            </label>
            <CurrencyFormat
              className="App__resultValue bold"
              value={futureValue}
              id="future-value"
              displayType="text"
              thousandSeparator={true}
              prefix="₹"
              decimalScale={0}
              onClick={() => alert(toWords?.convert(futureValue))}
            />
          </div>

          <div className="App__result">
            <label htmlFor="total-principal">Total Principal</label>
            <CurrencyFormat
              className="App__resultValue"
              value={totalPrincipal}
              id="total-principal"
              displayType="text"
              thousandSeparator={true}
              prefix="₹"
              decimalScale={0}
            />
          </div>

          <div className="App__result">
            <label htmlFor="total-contributions">Total Contributions</label>
            <CurrencyFormat
              className="App__resultValue"
              value={totalContributions}
              id="total-contributions"
              displayType="text"
              thousandSeparator={true}
              prefix="₹"
              decimalScale={0}
            />
          </div>

          <div className="App__result">
            <label htmlFor="total-interest" className="bold">
              Total Interest
            </label>
            <CurrencyFormat
              className="App__resultValue bold"
              value={totalInterest}
              id="total-interest"
              displayType="text"
              thousandSeparator={true}
              prefix="₹"
              decimalScale={0}
            />
          </div>

          <div className="App__result">
            <label htmlFor="inflation-adjusted" className="bold">
              Inflation Adjusted Value
            </label>
            <CurrencyFormat
              className="App__resultValue bold"
              value={inflationAdjustedValue}
              id="inflation-adjusted"
              displayType="text"
              thousandSeparator={true}
              prefix="₹"
              decimalScale={0}
              onClick={() => alert(toWords?.convert(inflationAdjustedValue))}
            />
          </div>

          <div className="App__chart">
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
