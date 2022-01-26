import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation, useQuery
  } from "@apollo/client";
import { CREATE_CHARACTERSHEET } from "../../gql"
import "./newcharactersheet.css";

function NewCharacterSheet() {

    const sessionUser = useSelector((state) => state.session.user);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState("");
    const [characterClass, setCharacterClass] = useState("");
    const [age, setAge] = useState(null);
    const [intelligence, setIntelligence] = useState(null);
    const [strength, setStrength] = useState(null);
    const [wisdom, setWisdom] = useState(null);
    const [agility, setAgility] = useState(null);
    const [dexterity, setDexterity] = useState(null);
    const [constitution, setConstitution] = useState(null);
    const [charisma, setCharisma] = useState(null);
    const [level, setLevel] = useState(1);
    const [alignment, setAlignment] = useState('');
    const [background, setBackground] = useState('');
    const [gender, setGender] = useState('');
    const [armor, setArmor] = useState('');
    const [armorclass, setArmorclass] = useState(null);
    const [initiative, setInitiative] = useState('');
    const [speed, setSpeed] = useState(null);
    const [maxhp, setMaxhp] = useState(null);
    const [currenthp, setCurrenthp] = useState(null);
    const [temphp, setTemphp] = useState(null);
    const [proficiencybonus, setProficiencybonus] = useState(null);
    const [passiveperception, setPassiveperception] = useState(null);
    const [spellsweapons, setSpellsweapons] = useState('');
    const [spellatkbonus, setSpellatkbonus] = useState(null);
    const [spellsknown, setSpellsknown] = useState('');
    const [preparedspells, setPreparedspells] = useState('');
    const [spellsavedc, setSpellsavedc] = useState(null);
    const [cantripsknown, setCantripsknown] = useState('');
    const [slotlevel, setSlotlevel] = useState(null);
    const [traits, setTraits] = useState('');
    const [languages, setLanguages] = useState('');
    const [proficiencies, setProficiencies] = useState('');
    const [weaponsspells, setWeaponsspells] = useState('');
    const [items, setItems] = useState('');
    const [currency, setCurrency] = useState('');
    const [notes, setNotes] = useState('');
    const [race, setRace] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [skills, setSkills] = useState('');
    const [other, setOther] = useState('');

    useEffect(() => {
        setUserId(sessionUser.id);
    },[sessionUser]);

    const [createCharacterSheet, { data }] = useMutation(CREATE_CHARACTERSHEET);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('userId', userId)
        createCharacterSheet({ variables: { name, userId, characterClass } });
        // setErrors([]);
    }

    return (
        <div className="gray-backdrop">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="formflex">
                        <div>
                            <label>Name</label>
                            <input type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Class</label>
                            <input type="text"
                            value={characterClass}
                            onChange={(e) => setCharacterClass(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Age</label>
                            <input type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Alignment</label>
                            <input type="text"
                            value={alignment}
                            onChange={(e) => setAlignment(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Background</label>
                            <input type="text"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Gender</label>
                            <input type="text"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Level</label>
                            <input type="number"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Race</label>
                            <input type="text"
                            value={race}
                            onChange={(e) => setRace(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Height</label>
                            <input type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Weight</label>
                            <input type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Intelligence</label>
                            <input type="number"
                            value={intelligence}
                            onChange={(e) => setIntelligence(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Wisdom</label>
                            <input type="number"
                            value={wisdom}
                            onChange={(e) => setWisdom(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Agility</label>
                            <input type="number"
                            value={agility}
                            onChange={(e) => setAgility(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Charisma</label>
                            <input type="number"
                            value={charisma}
                            onChange={(e) => setCharisma(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Constitution</label>
                            <input type="number"
                            value={constitution}
                            onChange={(e) => setConstitution(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Dexterity</label>
                            <input type="number"
                            value={dexterity}
                            onChange={(e) => setDexterity(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Strength</label>
                            <input type="number"
                            value={strength}
                            onChange={(e) => setStrength(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Armor</label>
                            <input type="text"
                            value={armor}
                            onChange={(e) => setArmor(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Armor Class</label>
                            <input type="number"
                            value={armorclass}
                            onChange={(e) => setArmorclass(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Initiative</label>
                            <input type="text"
                            value={initiative}
                            onChange={(e) => setInitiative(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Speed</label>
                            <input type="number"
                            value={speed}
                            onChange={(e) => setSpeed(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Max HP</label>
                            <input type="number"
                            value={maxhp}
                            onChange={(e) => setMaxhp(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Current HP</label>
                            <input type="number"
                            value={currenthp}
                            onChange={(e) => setCurrenthp(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Temp HP</label>
                            <input type="number"
                            value={temphp}
                            onChange={(e) => setTemphp(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Proficiency Bonus</label>
                            <input type="number"
                            value={proficiencybonus}
                            onChange={(e) => setProficiencybonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Passive Perception</label>
                            <input type="number"
                            value={passiveperception}
                            onChange={(e) => setPassiveperception(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Weapons</label>
                            <input type="text"
                            value={spellsweapons}
                            onChange={(e) => setSpellsweapons(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spells Known
                            </label>
                            <input type="text"
                            value={spellsknown}
                            onChange={(e) => setSpellsknown(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Prepared Spells</label>
                            <input type="text"
                            value={preparedspells}
                            onChange={(e) => setPreparedspells(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Save DC</label>
                            <input type="number"
                            value={spellsavedc}
                            onChange={(e) => setSpellsavedc(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                        <div>
                            <label>Spell Atk Bonus</label>
                            <input type="number"
                            value={spellatkbonus}
                            onChange={(e) => setSpellatkbonus(e.target.value)}
                            required/>
                        </div>
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    )
}

export default NewCharacterSheet;
