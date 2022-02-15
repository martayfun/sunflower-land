import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useActor } from "@xstate/react";

import basket from "assets/icons/basket.png";
import button from "assets/ui/button/round_button.png";

import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";

import { InventoryItems } from "./InventoryItems";
import { Context } from "features/game/GameProvider";

import { getShortcuts } from "../lib/shortcuts";
import { ITEM_DETAILS } from "features/game/types/images";
import { useTour } from "@reactour/tour";

export const Inventory: React.FC = () => {
  const { setCurrentStep: setCurrentTourStep, isOpen: tourIsOpen, currentStep } = useTour()
  const [isOpen, setIsOpen] = useState(false);
  const { shortcutItem, gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const shortcuts = getShortcuts();

  const handleInventoryClick = () => {
    setIsOpen(true) 
    if (tourIsOpen && currentStep === 1) {
      setTimeout(() => {
        setCurrentTourStep(2)
      }, 300)
    }
  }

  useEffect(() => {
    if (tourIsOpen && currentStep === 3) setIsOpen(false)
  }, [currentStep])

  return (
    <div className="flex flex-col items-end mr-2 sm:block fixed top-16 right-0 z-50">
      <div
        className="w-16 h-16 sm:mx-8 mt-2 relative flex justify-center items-center shadow rounded-full cursor-pointer"
        onClick={() => handleInventoryClick()}
        id="open-inventory"
      >
        <img
          src={button}
          className="absolute w-full h-full -z-10"
          alt="inventoryButton"
        />
        <img src={basket} className="w-8 mb-1" alt="inventory" />
        <Label className="hidden sm:block absolute -bottom-7">Inventory</Label>
      </div>

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <InventoryItems />
      </Modal>

      <div className="flex flex-col items-center sm:mt-8">
        {shortcuts.map((item, index) => (
          <Box
            key={index}
            isSelected={index === 0}
            image={ITEM_DETAILS[item].image}
            count={inventory[item]}
            onClick={() => shortcutItem(item)}
          />
        ))}
      </div>
    </div>
  );
};
