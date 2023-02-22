import axios from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react'
import { Button, DataTable, useTheme } from 'react-native-paper';
import { Button as RNButton, View, FlatList, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import { pokeAtom } from '../App';
import { IPokemon } from '../utils/Interfaces';
import { Constants } from '../utils/Constants';
import GetPokemon from '../services/GetPokemon';

export const Main = () => {
    const [pokemonsState, setPokemonsState] = useAtom(pokeAtom);
    const [modalVisible, setModalVisible] = useState(false);
    const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<IPokemon[]>([]);
    const [pokemonQuery, setPokemonQuery] = useState<string>('');
    const [selectedPoke, setSelectedPoke] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');

    const theme = useTheme();

    useEffect(() => {
        getPokemons();
    }, []);

    useEffect(() => {
        if (pokemonsState) {
            let typesClone = [...pokemonTypes];

            pokemonsState.map((poke: IPokemon) => {
                poke.types.map((type: string) => {
                    typesClone.indexOf(type) === -1 &&
                        typesClone.push(type);
                })
                setPokemonTypes(typesClone);
            });
        }
    }, [pokemonsState]);

    const getPokemons = () => {
        var _pokemons: IPokemon[] = [];

        for (var i = 1; i < Constants.POKEMON_LENGTH; i++) {
            GetPokemon(i).then((response: any) => {
                const poke: IPokemon = {
                    id: response.data.id,
                    name: response.data.name,
                    height: response.data.height,
                    weight: response.data.weight,
                    types: response.data.types.map((typeItem: any) => { return typeItem.type.name }),
                    image: response.data.sprites.front_default
                }
                _pokemons.push(poke);
                _pokemons.length === Constants.POKEMON_LENGTH - 1 && setPokemonsState(_pokemons);
            })
        }
    }

    // const getPokemons = () => {
    //     let endpoints: string[] = [], _pokemons: IPokemon[] = [];
    //     for (var i = 1; i < 20; i++) {
    //         endpoints.push(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    //     }
    //     axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res: any) => {
    //         if (res) {
    //             res.map((item: any) => {
    //                 if (item.data && item.status === 200) {
    //                     const poke: IPokemon = {
    //                         id: item.data.id,
    //                         name: item.data.name,
    //                         height: item.data.height,
    //                         weight: item.data.weight,
    //                         types: item.data.types.map((typeItem: any) => { return typeItem.type.name }),
    //                         image: item.data.sprites.front_default
    //                     }
    //                     _pokemons.push(poke);
    //                 }
    //             });
    //             setPokemonsState(_pokemons);
    //             setPokemonsState(_pokemons);
    //         }
    //     })
    // }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginVertical: 20,
        },
        row: {
            flexDirection: 'row',
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outlineVariant,
            padding: 10,
        },
        cell: {
            flex: 1,
            fontSize: 16,
        },
        header: {
            flexDirection: 'row',
            backgroundColor: theme.colors.outlineVariant,
            padding: 10,
            marginBottom: 10,
        },
        headerText: {
            flex: 1,
            textAlign: 'center',
            fontSize: 16,
        },
        search: {
            backgroundColor: '#1E1E1E',
            paddingTop: 20
        },
        title: {
            textAlign: 'center',
            color: theme.colors.onTertiary,
            fontSize: 20,
            fontWeight: 'bold',
        },
        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
        },
        typeButton: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: 150,
            borderWidth: 1,
            borderColor: '#868686'
        },
        modal: {
            width: 150,
            height: 150,
            backgroundColor: 'grey',
            position: 'absolute',
            top: (Dimensions.get('window').height / 2) - (75),
            left: (Dimensions.get('window').width / 2) - (75),
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    const filterPokemons = (query: string) => {
        let nameRes: IPokemon[] = filterPokemonsAccordingToName(query);
        let typeRes: IPokemon[] = filterPokemonsAccordingToType(query);
        return nameRes.concat(typeRes);
    }

    const filterPokemonsAccordingToType = (query: string) => {
        let result = pokemonsState.filter(poke => {
            let filteredPokemons = poke.types.filter((type: string) => type.includes(query));
            return filteredPokemons.length > 0;
        });

        return result;
    }

    const filterPokemonsAccordingToName = (query: string) => {
        let result = pokemonsState.filter(poke => poke.name.includes(query));
        return result;
    }

    const renderItem = ({ item }: any) => {
        return (
            <TouchableOpacity style={styles.row} onPress={() => {
                setModalVisible(true);
                setSelectedPoke(item.image);
            }}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.height}</Text>
                <Text style={styles.cell}>{item.weight}</Text>
                <Text style={styles.cell}>{item.types.map((typeItem: any, index: number) => { return index === item.types.length - 1 ? typeItem : `${typeItem}, ` })}</Text>
            </TouchableOpacity>
        );
    };

    const renderItemType = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedType(item);
                setFilteredPokemons(pokemonsState.filter((poke: IPokemon) => poke.types.includes(item)))
            }}

            style={[{ backgroundColor: selectedType === item ? '#FFA400' : theme.colors.onTertiary }, styles.typeButton]}>
            <Text>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.search}>
                <Text style={styles.title}>Search Your Pokemon</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", alignSelf: "center", margin: 20 }}>
                    <TextInput style={{ padding: 10, backgroundColor: theme.colors.onTertiary, width: Dimensions.get("window").width * 0.4 }} value={pokemonQuery} onChangeText={(text: string) => setPokemonQuery(text)} />
                    <TouchableOpacity onPress={() => {
                        // setFilteredPokemons(pokemonsState.filter((poke: IPokemon) => poke.name.includes(pokemonQuery)))}
                        setFilteredPokemons([] as IPokemon[]);
                        const _filteredPokemons = filterPokemons(pokemonQuery);

                        setFilteredPokemons(_filteredPokemons);
                    }}
                        style={{ backgroundColor: "#FFA400", justifyContent: "center", paddingHorizontal: 10 }}>
                        <Text style={{ textAlign: "center", color: "black" }}>Search</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={pokemonTypes}
                    renderItem={renderItemType}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={styles.container}
                data={filteredPokemons.length > 0 ? filteredPokemons : pokemonsState}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Name</Text>
                        <Text style={styles.headerText}>HEIGHT</Text>
                        <Text style={styles.headerText}>WEIGHT</Text>
                        <Text style={styles.headerText}>TYPES</Text>
                    </View>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal}>
                    {
                        selectedPoke &&
                        <Image
                            // style={styles.tinyLogo}
                            source={{ uri: selectedPoke }}
                            style={{ width: 150, height: 150 }}
                        />
                    }
                </View>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    )
}
