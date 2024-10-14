
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import CounterComponent from './components/Counter/CounterComponent';


ReactDOM.render(
  <Provider store={store}>
    <CounterComponent />
  </Provider>,
  document.getElementById('root')
);
