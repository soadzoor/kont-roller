import React from 'react';
import {ScrollView} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import ScooterMain from './ScooterMain';
import Locker from './components/Locker';
import Icon from './components/Icon';
import type {IExports} from './Api/types';
jest.mock('@react-native-async-storage/async-storage',()=>({__esModule:true,default:{getItem:jest.fn(),setItem:jest.fn()}}));

test('scooter controls remain scrollable and retain lock/unlock actions',()=>{
    const api={locked:false,battery:75,charging:false,led:false,lock:jest.fn(),unlock:jest.fn(),ledOn:jest.fn(),ledOff:jest.fn()} as unknown as IExports;
    let screen:renderer.ReactTestRenderer;
    act(()=>{screen=renderer.create(<ScooterMain mac="scooter" api={api} onBack={jest.fn()} onSettings={jest.fn()} />);});
    expect(screen!.root.findAllByType(ScrollView)).toHaveLength(1);
    act(()=>screen!.root.findByType(Locker).props.onClick());
    expect(api.lock).toHaveBeenCalledTimes(1);
    const lockedApi={...api,locked:true};
    act(()=>screen!.update(<ScooterMain mac="scooter" api={lockedApi} onBack={jest.fn()} onSettings={jest.fn()} />));
    act(()=>screen!.root.findByType(Locker).props.onClick());
    expect(api.unlock).toHaveBeenCalledTimes(1);
    expect(screen!.root.findAllByType(Icon).filter(icon=>icon.props.icon==='settings')).toHaveLength(0);
    act(()=>screen!.unmount());
});
