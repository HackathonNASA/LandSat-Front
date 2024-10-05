import DataFilter from "./DataFilter.jsx";
import LocationSelector from "./LocationSelector.jsx";
import { useState } from "react";
import ResultsDisplay from "./ResultsDisplay.jsx";

export default function SelectorFilterResult() {
    // Usar useState para manejar el estado booleano
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // Funciones para activar y desactivar el botón
    function setButtonEnabled() {

        setIsButtonEnabled(true);
    }

    function setButtonOff() {
        setIsButtonEnabled(false);
    }

    return (
        <>
            {/* Pasa las funciones a LocationSelector */}
            <LocationSelector
                onAddPin={setButtonEnabled}
                onRemovePin={setButtonOff}
                client:only="react"
            />
            {/* Pasa el estado al DataFilter */}
            <DataFilter
                isButtonEnabled={isButtonEnabled}
                client:only="react"
            />
            <ResultsDisplay client:only="react" />
        </>
    );
}
