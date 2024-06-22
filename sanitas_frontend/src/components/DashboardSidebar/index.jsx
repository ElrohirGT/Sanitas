/**
 * @typedef {Object} UserInformation
 * @property {string} displayName - The user display name.
 * @property {string} title - The role of this user in the application
 */

import returnicon from "@tabler/icons/outline/arrow-back-up.svg";
import boneicon from "@tabler/icons/outline/bone.svg";
import brainicon from "@tabler/icons/outline/brain.svg";
import facemaskicon from "@tabler/icons/outline/face-mask.svg";
import flowericon from "@tabler/icons/outline/flower.svg";
import glassicon from "@tabler/icons/outline/glass-full.svg";
import stethoscopeicon from "@tabler/icons/outline/stethoscope.svg";
import userloveicon from "@tabler/icons/outline/user-heart.svg";
import usericon from "@tabler/icons/outline/user.svg";
import familyicon from "@tabler/icons/outline/users-group.svg";
import womanicon from "@tabler/icons/outline/woman.svg";
import { useNavigate } from "react-router-dom";
import SanitasLogo from "src/assets/images/logoSanitas.png";
import { colors, fonts, fontSize } from "src/theme.mjs";

import IconButton from "src/components/Button/Icon/index";
import TextIconButton from "../Button/TextIcon";

/**
 * @callback SidebarNavigationHandler
 * @param {import("react-router-dom").NavigateFunction} navigate - The navigate returned from `useNavigate()`
 * @param {import("react").MouseEvent} e - The `MouseEvent` that triggered this handler.
 */

// NOTE: Remember to update the function signature when implementing the navigation to your view!
/**
 * @typedef {Object} DashboardSidebarProps
 * @property {SidebarNavigationHandler} navigateToGeneral - Handles navigation to the update general patient information view.
 * @property {SidebarNavigationHandler} navigateToAppointments - Handles navigation to the appointments view.
 * @property {SidebarNavigationHandler} navigateToPersonal - Handles navigation to the update personal information view.
 * @property {SidebarNavigationHandler} navigateToFamiliar - Handles navigation to the update familiar information view.
 * @property {SidebarNavigationHandler} navigateToAllergies - Handles navigation to the update allergies view.
 * @property {SidebarNavigationHandler} navigateToObstetrics - Handles navigation to the update obstetrics gynecologists view.
 * @property {SidebarNavigationHandler} navigateToNonPathological - Handles navigation to the update non pathological view.
 * @property {SidebarNavigationHandler} navigateToPsiquiatric - Handles navigation to the update psiquiatric view.
 * @property {SidebarNavigationHandler} navigateToSurgical - Handles navigation to the update surgical view.
 * @property {SidebarNavigationHandler} navigateToTraumatological - Handles navigation to the update traumatological view.
 * @property {SidebarNavigationHandler} onGoBack - Function that fires when the Back button is pressed.
 * @property {UserInformation} userInformation - Contains some information to display about a user.
 */

/**
 * @param {DashboardSidebarProps} props
 */
export default function DashboardSidebar({
  navigateToGeneral,
  navigateToAppointments,
  navigateToPersonal,
  navigateToFamiliar,
  navigateToAllergies,
  navigateToObstetrics,
  navigateToNonPathological,
  navigateToPsiquiatric,
  navigateToSurgical,
  navigateToTraumatological,
  userInformation,
  onGoBack,
}) {
  const navigate = useNavigate();
  const wrapWithNavigate = (func) => {
    /**
     * @type {import("react").MouseEventHandler}
     */
    return (e) => {
      func(navigate, e);
    };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.secondaryBackground,
        padding: "1rem",
        borderRadius: "0.625rem",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "end",
          paddingRight: "1rem",
          width: "100%",
        }}
      >
        <IconButton
          icon={returnicon}
          onClick={wrapWithNavigate(onGoBack)}
          style={{
            width: "2.1rem",
            height: "3rem",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          paddingTop: "2rem",
          paddingBottom: "2rem",
          width: "100%",
        }}
      >
        <img
          style={{
            width: "6rem",
            height: "3rem",
            flexGrow: 0,
          }}
          src={SanitasLogo}
          alt="Logo Sanitas"
        />
        <div
          style={{
            paddingLeft: "0.8rem",
            flexGrow: 1,
          }}
        >
          <h1
            style={{
              fontFamily: fonts.titleFont,
              fontWeight: "bold",
              fontSize: "1.1rem",
              paddingRight: "0.5rem",
              paddingTop: "0.4rem",
            }}
          >
            {userInformation.displayName}
          </h1>
          <h2
            style={{
              fontFamily: fonts.titleFont,
              fontWeight: "normal",
              fontSize: "0.9rem",
            }}
          >
            {userInformation.title}
          </h2>
        </div>
      </div>

      <TextIconButton
        icon={usericon}
        text="General"
        onClick={wrapWithNavigate(navigateToGeneral)}
      />
      <TextIconButton
        icon={stethoscopeicon}
        text="Citas"
        onClick={wrapWithNavigate(navigateToAppointments)}
      />

      <h3
        style={{
          color: colors.darkerGrey,
          fontSize: fontSize.textSize,
          fontWeight: "normal",
          paddingBottom: "1rem",
          paddingTop: "1rem",
          borderBottom: `0.1rem solid ${colors.darkerGrey}`,
        }}
      >
        Antecedentes
      </h3>

      <div
        style={{
          paddingTop: "1rem",
        }}
      >
        <TextIconButton
          icon={flowericon}
          text="Alérgicos"
          onClick={wrapWithNavigate(navigateToAllergies)}
        />
        <TextIconButton
          icon={familyicon}
          text="Familiares"
          onClick={wrapWithNavigate(navigateToFamiliar)}
        />
        <TextIconButton
          icon={womanicon}
          text="Ginecoobstétricos"
          onClick={wrapWithNavigate(navigateToObstetrics)}
        />
        <TextIconButton
          icon={glassicon}
          text="No patológicos"
          onClick={navigateToNonPathological}
        />
        <TextIconButton
          icon={userloveicon}
          text="Personales"
          onClick={wrapWithNavigate(navigateToPersonal)}
        />
        <TextIconButton
          icon={brainicon}
          text="Psiquiátricos"
          onClick={wrapWithNavigate(navigateToPsiquiatric)}
        />
        <TextIconButton
          icon={facemaskicon}
          text="Quirúrgicos"
          onClick={wrapWithNavigate(navigateToSurgical)}
        />
        <TextIconButton
          icon={boneicon}
          text="Traumatológicos"
          onClick={wrapWithNavigate(navigateToTraumatological)}
        />
      </div>
    </div>
  );
}
