# UIUC PHYS 213 — Proficiency Exam Topical Glossary

**Purpose:** recognition-first study sheet.  
**Format:** noun/idea → equations / associations / trigger words.  
**Scope:** current Fall 2026 PHYS 213 schedule + current formula sheet, with a final **Legacy / older-practice-exam vocabulary** section.

**Legend**
- **★** = explicitly on the current PHYS 213 formula sheet or named in the Fall 2026 schedule.
- **◇** = useful derived relation / standard consequence.
- **L** = appears in older UIUC PHYS 213 syllabi, formula guides, or practice exams; know it if using older practice material.

---

# 0. Constants, units, notation

## Physical constants

### ★ Boltzmann constant — \(k_B\), often written \(k\)
\[
k_B=1.380649\times10^{-23}\ \mathrm{J/K}
\]
\[
k_B=8.617333\times10^{-5}\ \mathrm{eV/K}
\]
\[
E_{\rm thermal}\sim k_BT
\]

### ★ Avogadro number — \(N_A\)
\[
N_A=6.022\times10^{23}\ \mathrm{mol^{-1}}
\]
\[
N=nN_A
\]

### ★ Ideal-gas constant — \(R\)
\[
R=N_Ak_B
\]
\[
R=8.314\ \mathrm{J/(mol\,K)}
\]
\[
R=8.206\times10^{-2}\ \mathrm{L\,atm/(mol\,K)}
\]

### ★ Atmosphere
\[
1\ \mathrm{atm}=1.013\times10^5\ \mathrm{Pa}
\]
\[
1\ \mathrm{Pa}=1\ \mathrm{J/m^3}
\]

### ★ Electron volt
\[
1\ \mathrm{eV}=1.602\times10^{-19}\ \mathrm J
\]

### ★ Planck constant
\[
h=6.626\times10^{-34}\ \mathrm{J\,s}
\]
\[
h=4.135\times10^{-15}\ \mathrm{eV\,s}
\]

### ★ Reduced Planck constant
\[
\hbar=\frac{h}{2\pi}
\]
\[
\hbar=1.054\times10^{-34}\ \mathrm{J\,s}
\]

### ★ Speed of light
\[
c=2.998\times10^8\ \mathrm{m/s}
\]

### ★ Gravity near Earth
\[
g=9.8\ \mathrm{m/s^2}
\]

### ★ Elementary charge
\[
e=1.602\times10^{-19}\ \mathrm C
\]

### ★ Electron magnetic moment
\[
\mu_e\approx9.285\times10^{-24}\ \mathrm{J/T}
\]

### ★ Proton magnetic moment
\[
\mu_p\approx1.411\times10^{-26}\ \mathrm{J/T}
\]

### ★ Particle masses
\[
m_e=9.109\times10^{-31}\ \mathrm{kg}
\]
\[
m_p=1.673\times10^{-27}\ \mathrm{kg}
\]
\[
m_n=1.675\times10^{-27}\ \mathrm{kg}
\]

---

# 1. Mathematical/statistical vocabulary

## ★ Natural logarithm
\[
\ln A-\ln B=\ln(A/B)
\]
\[
\ln(AB)=\ln A+\ln B
\]

## ★ Exponential
\[
e^{A+B}=e^Ae^B
\]

## ★ Factorial
\[
N!=N(N-1)(N-2)\cdots1
\]

## ★ Binomial coefficient / combinations
Choose \(q\) objects from \(N\):
\[
\binom Nq=\frac{N!}{q!(N-q)!}
\]

## ★ Distinguishable particles
\(N\) distinguishable particles, \(M\) states each:
\[
\Omega=M^N
\]

## ★ Indistinguishable-particle counting approximation
Course formula-sheet form:
\[
\Omega\sim\frac{M^N}{N!}
\]

## ★ Stars-and-bars / oscillator multiplicity
Distribute \(q\) identical quanta among \(N\) oscillators:
\[
\Omega=\binom{N+q-1}{q}
\]

## ◇ Stirling approximation
For large \(N\):
\[
\ln N!\approx N\ln N-N
\]
More accurate:
\[
\ln N!\approx N\ln N-N+\frac12\ln(2\pi N)
\]

## Probability
\[
0\le P_i\le1,\qquad \sum_iP_i=1
\]

## Mean / expectation value
\[
\langle X\rangle=\sum_iP_iX_i
\]

## ★ Mean energy
\[
U=\langle E\rangle=\sum_iP_iE_i
\]

## Degeneracy — \(g_i\) or \(d_i\)
Number of distinct states with the same energy \(E_i\).

## Macrostate
Specified by bulk variables / coarse information.

## Microstate
One microscopic realization of a macrostate.

## ★ Multiplicity — \(\Omega\)
Number of equally probable microstates compatible with a macrostate.

## Most probable macrostate
Macrostate with largest \(\Omega\), equivalently largest \(S\).

## Statistical independence
\[
\Omega_{\rm tot}=\Omega_A\Omega_B
\]
for independent subsystems.

---

# 2. Thermodynamic system vocabulary

## System
Chosen physical degrees of freedom being studied.

## Surroundings / environment
Everything outside the system.

## Boundary
Separates system and surroundings.

## Isolated system
No energy or particle exchange.

## Closed system
Energy exchange allowed; particle number fixed.

## Open system
Energy and particle exchange allowed.

## Reservoir
Large system whose intensive variable changes negligibly during exchange.

## Thermal reservoir / heat bath
Large reservoir with approximately fixed \(T\).

## Mechanical equilibrium
No net tendency for volume/work exchange; typically equal pressures.

## Thermal equilibrium
No net heat flow:
\[
T_A=T_B
\]

## Diffusive / particle equilibrium
No net particle transfer:
\[
\mu_A=\mu_B
\]

## Thermodynamic equilibrium
Simultaneous applicable thermal, mechanical, and particle equilibrium.

## State variable / state function
Depends only on equilibrium state, not path.  
Examples:
\[
U,S,T,p,V,N,H,F,G
\]

## Path-dependent quantity
Depends on process history.  
Examples:
\[
Q,\ W
\]

## Extensive variable
Scales with system size.  
Examples:
\[
U,S,V,N,H,F,G
\]

## Intensive variable
Does not scale with system size.  
Examples:
\[
T,p,\mu,\rho
\]

---

# 3. Internal energy and microscopic energy

## ★ Internal energy — \(U\)
Total internal microscopic energy.

## Translational kinetic energy
\[
K_{\rm trans}=\frac12m(v_x^2+v_y^2+v_z^2)
\]

## Rotational energy
Energy associated with molecular rotation.

## Vibrational energy
Energy associated with molecular vibration.

## Electronic energy
Energy of electronic configurations / bands / levels.

## Binding energy
Energy required to remove/break a bound constituent.

## Ground state
Lowest allowed energy state.

## Excited state
Allowed energy state above ground.

## Energy level spacing
\[
\Delta E=E_{i+1}-E_i
\]

## Thermal energy scale
\[
k_BT
\]

## Classical limit
Usually:
\[
\Delta E\ll k_BT
\]

## Quantum/frozen-mode regime
Usually:
\[
\Delta E\gtrsim k_BT
\]

---

# 4. Temperature, pressure, chemical potential from entropy

## ★ Temperature — \(T\)
\[
\boxed{\frac1T=\left(\frac{\partial S}{\partial U}\right)_{V,N}}
\]

## ★ Pressure — \(p\)
\[
\boxed{\frac pT=\left(\frac{\partial S}{\partial V}\right)_{U,N}}
\]

## ★ Chemical potential — \(\mu\)
\[
\boxed{\frac{\mu}{T}=-\left(\frac{\partial S}{\partial N}\right)_{U,V}}
\]

## ★ Fundamental thermodynamic relation
Entropy representation:
\[
\boxed{dS=\frac1T\,dU+\frac pT\,dV-\frac{\mu}{T}\,dN}
\]

Equivalent energy representation:
\[
\boxed{dU=T\,dS-p\,dV+\mu\,dN}
\]

## ◇ Equilibrium by entropy maximization
For an isolated composite system:
\[
S_{\rm total}\to\max
\]

Energy exchange equilibrium:
\[
T_A=T_B
\]

Volume exchange equilibrium:
\[
p_A=p_B
\]

Particle exchange equilibrium:
\[
\mu_A=\mu_B
\]

---

# 5. Heat, work, First Law

## ★ Heat — \(Q\)
Energy transferred because of thermal interaction.

## ★ Work done by the system
For quasistatic \(pV\) work:
\[
dW_{\rm by}=p\,dV
\]

## ★ Work done on the system
\[
dW_{\rm on}=-p\,dV
\]

## ★ First Law of Thermodynamics
\[
\boxed{dU=dQ-p\,dV}
\]
or
\[
\Delta U=Q-W_{\rm by}
\]

## Expansion
\[
dV>0\Rightarrow dW_{\rm by}>0
\]

## Compression
\[
dV<0\Rightarrow dW_{\rm by}<0
\]

## ★ Work on a \(p\)-\(V\) diagram
\[
W_{\rm by}=\int_{V_i}^{V_f}p\,dV
\]
Area under process curve.

## Cyclic process
\[
\Delta U_{\rm cycle}=0
\]
\[
Q_{\rm net}=W_{\rm net}
\]

## Area enclosed by a \(pV\) cycle
Magnitude = net work per cycle.  
Clockwise cycle: usually \(W_{\rm by}>0\).

---

# 6. Heat capacity and calorimetry

## ★ Heat capacity — \(C\)
\[
C\equiv\frac{dQ}{dT}
\]

## Specific heat — \(c\)
\[
C=mc
\]
For approximately constant \(c\):
\[
Q=mc\Delta T
\]

## Molar heat capacity
\[
C=nC_m
\]

## ★ Constant-volume heat capacity — \(C_V\)
At fixed \(V,N\):
\[
\boxed{C_V=\left(\frac{\partial U}{\partial T}\right)_V}
\]

## ★ Constant-pressure heat capacity — \(C_p\)
\[
\boxed{C_p=\frac{dU}{dT}+p\frac{dV}{dT}}
\]
For ordinary \(pV\)-work systems:
\[
C_p=\left(\frac{\partial H}{\partial T}\right)_p
\]

## ◇ Ideal gas
\[
C_p-C_V=Nk_B=nR
\]

## Calorimetry / isolated thermal mixing
\[
\sum_iQ_i=0
\]
if no energy escapes.

## Thermal equilibrium temperature
Solve energy conservation:
\[
\sum_i C_i(T_f-T_i)=0
\]
for constant heat capacities.

## Temperature-dependent heat capacity
\[
Q=\int_{T_i}^{T_f}C(T)\,dT
\]

## Entropy change from heat capacity
For a reversible path:
\[
\Delta S=\int_{T_i}^{T_f}\frac{C(T)}{T}\,dT
\]

Constant \(C\):
\[
\Delta S=C\ln\frac{T_f}{T_i}
\]

---

# 7. Heat conduction

## ★ Thermal conductivity — \(\kappa\) or \(k_{\rm th}\)
Fourier law:
\[
q=-\kappa\frac{dT}{dx}
\]
Approximate slab:
\[
q\approx-\kappa\frac{\Delta T}{L}
\]

If \(q\) is heat flux:
\[
\frac{\dot Q}{A}=-\kappa\frac{dT}{dx}
\]

Steady planar conduction:
\[
\dot Q=\kappa A\frac{T_H-T_C}{L}
\]

## Temperature gradient
\[
\nabla T
\]

## Steady state
Macroscopic temperature profile time-independent.

## Thermal resistance
\[
R_{\rm th}=\frac{L}{\kappa A}
\]
\[
\dot Q=\frac{\Delta T}{R_{\rm th}}
\]

## Series thermal resistances
\[
R_{\rm th,tot}=\sum_iR_{{\rm th},i}
\]

---

# 8. Ideal gases

## ★ Ideal gas
Negligible interaction energy except collisions; equation of state:
\[
\boxed{pV=Nk_BT=nRT}
\]

## Equation of state
Relation among thermodynamic state variables, e.g.
\[
p=p(T,V,N)
\]

## Number density
\[
n_{\rm number}=\frac NV
\]

## Mass density
\[
\rho=\frac mV
\]

## Mole
\[
n_{\rm mol}=\frac N{N_A}
\]

## Ideal-gas pressure form
\[
p=\frac{Nk_BT}{V}
\]

## Ideal-gas internal energy
Depends only on \(T\):
\[
U=U(T)
\]

## ★ Kinetic-theory mean-square speed
\[
\boxed{\frac12m\langle v^2\rangle=\frac32k_BT}
\]

## RMS speed
\[
v_{\rm rms}=\sqrt{\langle v^2\rangle}
=\sqrt{\frac{3k_BT}{m}}
\]

## Mean translational kinetic energy
\[
\langle K_{\rm trans}\rangle=\frac32k_BT
\]

## Pressure from molecular collisions
\[
p=\frac13\frac NVm\langle v^2\rangle
\]

## Mean free path
Typical distance between collisions.  
Recognition: dilute gas / collision rate / transport.

---

# 9. Degrees of freedom and equipartition

## ★ Degree of freedom — DOF
Independent quadratic energy contribution counted by equipartition.

## ★ Equipartition theorem
Each independent quadratic term contributes:
\[
\boxed{\frac12k_BT}
\]
to mean energy.

## ★ General equipartition internal energy
\[
\boxed{U=\frac{N_{\rm DOF}}2Nk_BT+\text{constant}}
\]

## Translation
Three translational DOF in 3D:
\[
U_{\rm trans}=\frac32Nk_BT
\]

## Rotation
Each active quadratic rotational DOF contributes:
\[
\frac12Nk_BT
\]

## Vibration
Each vibrational mode contains kinetic + potential quadratic pieces:
\[
\text{1 vibration mode}\Rightarrow 2\ \text{DOF}
\]
Classical contribution per mode:
\[
Nk_BT
\]

## Monatomic ideal gas
\[
N_{\rm DOF}=3
\]
\[
U=\frac32Nk_BT
\]
\[
C_V=\frac32Nk_B
\]
\[
C_p=\frac52Nk_B
\]
\[
\gamma=\frac53
\]

## Diatomic ideal gas, rotations active and vibrations frozen
\[
N_{\rm DOF}=5
\]
\[
U=\frac52Nk_BT
\]
\[
C_V=\frac52Nk_B
\]
\[
C_p=\frac72Nk_B
\]
\[
\gamma=\frac75
\]

## ★ Adiabatic index
\[
\boxed{\gamma=\frac{C_p}{C_V}=1+\frac{2}{N_{\rm DOF}}}
\]

## Frozen degree of freedom
Quantum spacing too large:
\[
hf\gg k_BT
\]
Mode contributes little thermal heat capacity.

---

# 10. Entropy and Second Law

## ★ Entropy — \(S\)
Statistical:
\[
\boxed{S=k_B\ln\Omega}
\]

## Dimensionless entropy
\[
\sigma\equiv\frac S{k_B}=\ln\Omega
\]

## ★ Second Law
For an isolated system:
\[
\boxed{\Delta S_{\rm total}\ge0}
\]

Reversible:
\[
\Delta S_{\rm total}=0
\]

Irreversible:
\[
\Delta S_{\rm total}>0
\]

## Reversible heat relation
\[
\boxed{dS=\frac{dQ_{\rm rev}}{T}}
\]

## ★ At constant particle number
Along reversible heating:
\[
dS=\frac{dQ_{\rm rev}}T
=\frac CT\,dT
\]

## Entropy increase
Direction of spontaneous evolution for isolated system.

## Entropy maximization
Equilibrium macrostate maximizes total entropy subject to constraints.

## Entropy of independent subsystems
\[
S_{\rm tot}=S_A+S_B
\]

## Entropy change: ideal gas
\[
\boxed{\Delta S=C_V\ln\frac{T_f}{T_i}
+Nk_B\ln\frac{V_f}{V_i}}
\]

Equivalent:
\[
\boxed{\Delta S=C_p\ln\frac{T_f}{T_i}
-Nk_B\ln\frac{p_f}{p_i}}
\]

## Isothermal ideal-gas entropy change
\[
\Delta S=Nk_B\ln\frac{V_f}{V_i}
=-Nk_B\ln\frac{p_f}{p_i}
\]

## Entropy of mixing
Recognition: initially separated distinguishable gases mix spontaneously.

For ideal gases:
\[
\Delta S_{\rm mix}>0
\]

---

# 11. Reversible, irreversible, quasistatic

## ★ Quasistatic process
System passes through states arbitrarily close to equilibrium.

## Reversible process
Can be reversed while restoring system + environment with no net entropy production.

## Irreversible process
Produces entropy:
\[
\Delta S_{\rm universe}>0
\]

## Free expansion
Expansion into vacuum:
\[
W=0
\]
For isolated free expansion:
\[
Q=0
\]
\[
\Delta U=0
\]
For ideal gas:
\[
\Delta T=0
\]
but
\[
\Delta S>0
\]

## Friction
Canonical source of irreversibility.

## Finite temperature-gradient heat flow
Hot \(\to\) cold; irreversible.

## Infinitesimal-gradient heat transfer
Reversible limit.

---

# 12. Named thermodynamic processes

## ★ Isothermal
\[
T=\mathrm{const}
\]

Ideal gas:
\[
pV=\mathrm{const}
\]
\[
\Delta U=0
\]
\[
Q=W_{\rm by}
\]
Reversible ideal-gas work:
\[
\boxed{W_{\rm by}=Nk_BT\ln\frac{V_f}{V_i}}
\]

## ★ Isochoric / isovolumetric
\[
V=\mathrm{const}
\]
\[
W_{\rm by}=0
\]
\[
Q=\Delta U
\]

## ★ Isobaric
\[
p=\mathrm{const}
\]
\[
W_{\rm by}=p(V_f-V_i)
\]
\[
Q_p=\Delta H
\]
for ordinary \(pV\)-work at constant pressure.

## ★ Adiabatic
\[
Q=0
\]

For reversible ideal gas:
\[
\boxed{pV^\gamma=\mathrm{const}}
\]
\[
\boxed{TV^{\gamma-1}=\mathrm{const}}
\]
\[
\boxed{T^\gamma p^{1-\gamma}=\mathrm{const}}
\]

Adiabatic work:
\[
W_{\rm by}=-\Delta U
\]

## Isentropic
\[
S=\mathrm{const}
\]
Reversible adiabatic \(\Rightarrow\) isentropic.

## Important distinction
Adiabatic \(\neq\) automatically isothermal.  
Quasistatic \(\neq\) automatically adiabatic.  
Isobaric/isochoric \(\neq\) intrinsically irreversible.

---

# 13. Thermodynamic cycles, engines, refrigerators

## ★ Thermodynamic cycle
Final state = initial state:
\[
\Delta U=0
\]

## ★ Heat engine
Absorbs \(Q_H\), rejects \(Q_C\), performs work \(W\):
\[
W=Q_H-Q_C
\]

## ★ Thermal efficiency
\[
\boxed{\eta=\frac W{Q_H}=1-\frac{Q_C}{Q_H}}
\]

## Hot reservoir
Temperature \(T_H\).

## Cold reservoir
Temperature \(T_C\).

## ★ Carnot engine
Ideal reversible engine between \(T_H\) and \(T_C\).

## ★ Carnot efficiency
\[
\boxed{\eta_{\max}=1-\frac{T_C}{T_H}}
\]

## Carnot cycle
Two reversible isotherms + two reversible adiabats.

## Refrigerator
Uses work \(W\) to remove heat \(Q_C\) from cold reservoir.

## ★ Refrigerator coefficient of performance
\[
\boxed{\mathrm{COP_R}=\frac{Q_C}{W}}
\]
Carnot limit:
\[
\boxed{\mathrm{COP_R}\le\frac{T_C}{T_H-T_C}}
\]

## Heat pump
Uses work to deliver heat \(Q_H\) to hot reservoir.

## ★ Heat-pump coefficient of performance
\[
\boxed{\mathrm{COP_{HP}}=\frac{Q_H}{W}}
\]
Carnot limit:
\[
\boxed{\mathrm{COP_{HP}}\le\frac{T_H}{T_H-T_C}}
\]
Equivalent:
\[
\mathrm{COP_{HP}}\le\frac1{1-T_C/T_H}
\]

## Kelvin-Planck statement
No cyclic engine can convert heat from one reservoir entirely into work.

## Clausius statement
Heat does not spontaneously flow cold \(\to\) hot without external work.

---

# 14. Enthalpy

## ★ Enthalpy — \(H\)
\[
\boxed{H=U+pV}
\]

## Differential
\[
dH=dU+p\,dV+V\,dp
\]

Using fundamental relation:
\[
dH=T\,dS+V\,dp+\mu\,dN
\]

## Constant pressure
For fixed \(N\) and only \(pV\) work:
\[
Q_p=\Delta H
\]

## Ideal gas enthalpy
\[
H=H(T)
\]

## Latent heat
At phase coexistence:
\[
L=\Delta H
\]

---

# 15. Helmholtz and Gibbs free energies

## Helmholtz free energy — \(F\)  [L / useful]
\[
\boxed{F=U-TS}
\]

Natural variables:
\[
F=F(T,V,N)
\]

Differential:
\[
dF=-S\,dT-p\,dV+\mu\,dN
\]

At fixed \(T,V,N\):
\[
F\to\min
\]

Maximum useful work under appropriate fixed-\(T,V\) conditions:
\[
W_{\max}=-\Delta F
\]

## ★ Gibbs free energy — \(G\)
\[
\boxed{G=U-TS+pV=H-TS}
\]

Natural variables:
\[
G=G(T,p,N)
\]

Differential:
\[
\boxed{dG=-S\,dT+V\,dp+\mu\,dN}
\]

## ★ Gibbs minimum principle
At fixed \(T,p,N\):
\[
\boxed{G\to\min}
\]

## ★ Maximum work
Course formula-sheet form:
\[
\boxed{W_{\max}=-\Delta G}
\]

## ★ Chemical potential from Gibbs free energy
\[
\boxed{\mu=\left(\frac{\partial G}{\partial N}\right)_{T,p}}
\]

## Single-component extensive system
\[
\boxed{G=\mu N}
\]

---

# 16. Chemical potential

## ★ Chemical potential — \(\mu\)
Energy/free-energy cost of adding particles under specified conditions.

Entropy definition:
\[
\frac{\mu}{T}
=-\left(\frac{\partial S}{\partial N}\right)_{U,V}
\]

Gibbs definition:
\[
\mu=\left(\frac{\partial G}{\partial N}\right)_{T,p}
\]

Helmholtz form:
\[
\mu=\left(\frac{\partial F}{\partial N}\right)_{T,V}
\]

## Particle flow
Particles tend toward lower chemical potential when transfer is allowed.

## Diffusive equilibrium
\[
\mu_A=\mu_B
\]

## Phase equilibrium
For same species in phases \(\alpha,\beta\):
\[
\boxed{\mu_\alpha=\mu_\beta}
\]

## Chemical equilibrium
For reaction:
\[
\sum_i\nu_i\mu_i=0
\]

---

# 17. Boltzmann factors and canonical probabilities

## ★ Boltzmann factor
For state \(i\):
\[
\boxed{f_i=e^{-E_i/(k_BT)}}
\]

## ★ Partition function — \(Z\)
\[
\boxed{Z=\sum_j e^{-E_j/(k_BT)}}
\]
With degeneracy:
\[
\boxed{Z=\sum_jg_je^{-E_j/(k_BT)}}
\]

## ★ Probability of state \(i\)
\[
\boxed{P_i=\frac{e^{-E_i/(k_BT)}}{Z}}
\]
For energy level with degeneracy \(g_i\):
\[
\boxed{P(E_i)=\frac{g_ie^{-E_i/(k_BT)}}{Z}}
\]

## Probability ratio
\[
\boxed{\frac{P_2}{P_1}
=\frac{g_2}{g_1}e^{-(E_2-E_1)/(k_BT)}}
\]

## Two-level system
Energies \(E_0,E_1\):
\[
Z=e^{-\beta E_0}+e^{-\beta E_1}
\]
where
\[
\beta=\frac1{k_BT}
\]

If \(E_0=0,\ E_1=\Delta\):
\[
P_1=\frac{e^{-\Delta/k_BT}}{1+e^{-\Delta/k_BT}}
\]
\[
P_0=\frac1{1+e^{-\Delta/k_BT}}
\]

## High-temperature limit
\[
k_BT\gg\Delta E
\]
Accessible states tend toward equal occupation per microstate.

## Low-temperature limit
Lowest-energy state(s) dominate.

## ★ Mean internal energy
\[
\boxed{U=\sum_iP_iE_i}
\]

## ◇ Energy from partition function
\[
U=-\frac{\partial\ln Z}{\partial\beta}
\]

## ◇ Helmholtz free energy from \(Z\)
\[
F=-k_BT\ln Z
\]

## ◇ Entropy from \(Z\)
\[
S=k_B(\ln Z+\beta U)
\]

---

# 18. Spins and paramagnetism

## Magnetic moment
\[
\boldsymbol{\mu}
\]

## Magnetic energy
\[
\boxed{E=-\boldsymbol{\mu}\cdot\mathbf B}
\]

## Two-state spin in field
Parallel:
\[
E_\uparrow=-\mu B
\]
Antiparallel:
\[
E_\downarrow=+\mu B
\]

Energy separation:
\[
\Delta E=2\mu B
\]

## Spin partition function
\[
Z=e^{\mu B/k_BT}+e^{-\mu B/k_BT}
=2\cosh\left(\frac{\mu B}{k_BT}\right)
\]

## Spin probabilities
\[
P_\uparrow=\frac{e^{\mu B/k_BT}}Z
\]
\[
P_\downarrow=\frac{e^{-\mu B/k_BT}}Z
\]

## Net magnetic moment / magnetization of \(N\) independent spins
\[
M=N\mu(P_\uparrow-P_\downarrow)
\]
\[
\boxed{M=N\mu\tanh\left(\frac{\mu B}{k_BT}\right)}
\]

## Curie-law limit
For
\[
\frac{\mu B}{k_BT}\ll1
\]
\[
\tanh x\approx x
\]
so
\[
\boxed{M\approx\frac{N\mu^2B}{k_BT}}
\]
\[
M\propto\frac BT
\]

## Magnetic saturation
\[
\mu B\gg k_BT
\]
Most spins occupy lower magnetic-energy orientation.

---

# 19. Quantum harmonic oscillators / solid heat capacity

## Harmonic oscillator
Quantum level spacing:
\[
\Delta E=hf=\hbar\omega
\]

## Quantum of vibrational energy
\[
\epsilon=hf
\]

## Dimensionless quantum/thermal ratio
\[
\boxed{x=\frac{hf}{k_BT}}
\]

## Classical regime
\[
x\ll1
\]

## Quantum/frozen regime
\[
x\gg1
\]

## ★ Einstein-solid heat capacity form
For \(3N\) oscillators:
\[
\boxed{
C_V=3Nk_B
\frac{x^2e^x}{(e^x-1)^2},
\qquad
x=\frac{hf}{k_BT}
}
\]

## High-\(T\) limit
\[
C_V\to3Nk_B
\]
Dulong-Petit limit.

## Low-\(T\) Einstein limit
\[
C_V\to0
\]

## ★ Oscillator multiplicity
\[
\boxed{\Omega=\binom{N+q-1}{q}}
\]

## Energy quanta
\[
U=q\,hf
\]
(up to zero-point offset if included).

## Equipartition failure
Occurs because allowed quantum energy changes are not effectively continuous when:
\[
hf\gtrsim k_BT
\]

---

# 20. Semiconductors

## ★ Semiconductor
Material whose thermally available charge carriers depend strongly on an energy gap.

## Valence band
Normally occupied band.

## Conduction band
Higher-energy mobile-carrier band.

## Band gap — \(\Delta\) or \(E_g\)
Energy required to create mobile electron-hole excitation.

## Electron
Negative mobile carrier in conduction band.

## Hole
Missing valence electron behaving as positive carrier.

## Electron-hole pair
Thermally generated conducting pair.

## Intrinsic semiconductor
Pure semiconductor; electrons and holes generated thermally in pairs.

## ★ Thermally activated carrier fraction
Course formula-sheet form:
\[
\boxed{
\frac{N_{\rm conductors}}{N_{\rm atoms}}
=C\,e^{-\Delta/(2k_BT)}
}
\]

## Intrinsic carrier density
\[
n_i\propto e^{-E_g/(2k_BT)}
\]

## Electron-hole mass-action relation [L]
\[
\boxed{n_en_h=n_i^2}
\]

## ★ Conductivity
Course statement:
\[
\boxed{\sigma\propto N_{\rm conductors}}
\]
More generally:
\[
\sigma=e(n_e\mu_e+n_h\mu_h)
\]

## Temperature dependence
Intrinsic carrier concentration rises rapidly with \(T\).

---

# 21. Phases and phase transitions

## ★ Phase
Thermodynamically distinct macroscopic state.

## Phase equilibrium
At common \(T,p\), coexisting phases satisfy:
\[
\boxed{\mu_\alpha=\mu_\beta}
\]

## ★ Stable phase
At fixed \(T,p\), phase with lowest chemical potential:
\[
\boxed{\mu_{\rm lowest}\Rightarrow\text{equilibrium phase}}
\]

## Phase coexistence
Two phases can coexist on a phase boundary where:
\[
\mu_\alpha=\mu_\beta
\]

## ★ Latent heat — \(L\)
\[
\boxed{L=\Delta H=T\Delta S}
\]
(on a coexistence transition).

## Fusion / melting
solid \(\leftrightarrow\) liquid.

## Vaporization / boiling
liquid \(\leftrightarrow\) gas.

## Sublimation
solid \(\leftrightarrow\) gas.

## Condensation
gas \(\to\) liquid.

## Freezing
liquid \(\to\) solid.

## Vapor pressure
Equilibrium gas pressure above condensed phase at a given \(T\).

## Saturated vapor
Gas at its equilibrium vapor pressure.

## Phase diagram
Usually \(p\)-\(T\) map of stable phases and coexistence boundaries.

## Phase boundary / coexistence curve
Set of \(p,T\) satisfying equality of chemical potentials.

## Triple point
Three phases coexist:
\[
\mu_1=\mu_2=\mu_3
\]

## Critical point
Termination of liquid-gas coexistence boundary; liquid and gas become indistinguishable.

## ★ Chemical-potential differential for phase \(X\)
\[
\boxed{
d\mu_X=
\frac{V_X}{N_X}\,dp
-\frac{S_X}{N_X}\,dT
}
\]

Define molar/per-particle volume:
\[
v=\frac VN
\]

Define entropy per particle:
\[
s=\frac SN
\]

Then:
\[
d\mu=v\,dp-s\,dT
\]

## ◇ Clapeyron equation
Along coexistence:
\[
d\mu_\alpha=d\mu_\beta
\]
therefore
\[
\boxed{
\frac{dp}{dT}
=\frac{\Delta s}{\Delta v}
=\frac{L}{T\Delta v}
}
\]

## Clausius-Clapeyron approximation [L]
For liquid-vapor coexistence with ideal vapor and \(v_g\gg v_l\):
\[
\frac{d\ln p_{\rm vap}}{dT}
=\frac{L}{RT^2}
\]
If \(L\) approximately constant:
\[
\ln\frac{p_2}{p_1}
=-\frac{L}{R}\left(\frac1{T_2}-\frac1{T_1}\right)
\]

---

# 22. Gibbs free energy and phases

## Phase stability at fixed \(T,p\)
\[
G\to\min
\]

For one species:
\[
G=N\mu
\]

So:
\[
\mu_{\rm lowest}\Rightarrow G_{\rm lowest}
\]

## Phase boundary
\[
G_\alpha=G_\beta
\]
or per particle:
\[
\mu_\alpha=\mu_\beta
\]

## Temperature slope of \(\mu\) at fixed \(p\)
\[
\boxed{\left(\frac{\partial\mu}{\partial T}\right)_p=-\frac SN=-s}
\]

## Pressure slope of \(\mu\) at fixed \(T\)
\[
\boxed{\left(\frac{\partial\mu}{\partial p}\right)_T=\frac VN=v}
\]

High-entropy phase: steeper downward \(\mu(T)\).  
Large-specific-volume phase: steeper upward \(\mu(p)\).

---

# 23. Thermal radiation and greenhouse effects

## ★ Thermal radiation
Electromagnetic radiation emitted because matter has finite temperature.

## Blackbody
Ideal absorber/emitter.

## Emissivity — \(\epsilon\)
\[
0\le\epsilon\le1
\]

## ◇ Stefan-Boltzmann law
Radiated power per unit area:
\[
\boxed{j^\star=\epsilon\sigma_{\rm SB}T^4}
\]
Blackbody:
\[
j^\star=\sigma_{\rm SB}T^4
\]
\[
\sigma_{\rm SB}=5.670\times10^{-8}\ \mathrm{W\,m^{-2}K^{-4}}
\]

## Total radiated power
\[
P=\epsilon\sigma_{\rm SB}AT^4
\]

## Net radiative exchange
For object in environment \(T_{\rm env}\):
\[
P_{\rm net}
=\epsilon\sigma_{\rm SB}A
(T^4-T_{\rm env}^4)
\]

## ◇ Wien displacement law
\[
\boxed{\lambda_{\max}T=b}
\]
\[
b\approx2.90\times10^{-3}\ \mathrm{m\,K}
\]

## Photon energy
\[
E=hf=\frac{hc}{\lambda}
\]

## Thermal-radiation quantum parameter
\[
\frac{hf}{k_BT}
\]

## Planck spectrum
Recognition: full blackbody spectral distribution; classical equipartition fails at high frequency.

## Ultraviolet catastrophe
Classical Rayleigh-Jeans prediction diverges at high frequency; cured by quantized \(hf\).

## Greenhouse effect
Atmosphere absorbs/emits selected infrared wavelengths, changing radiative energy balance.

## Solar/planetary energy balance
Absorbed power = emitted power at radiative equilibrium.

For incident flux \(F_\odot\), albedo \(A\), spherical planet radius \(R\):
\[
(1-A)F_\odot\pi R^2
=4\pi R^2\epsilon\sigma_{\rm SB}T^4
\]

Hence:
\[
T=
\left[
\frac{(1-A)F_\odot}
{4\epsilon\sigma_{\rm SB}}
\right]^{1/4}
\]

## Albedo
Fraction of incident radiation reflected.

## Infrared absorption
Relevant to molecular vibrational/rotational modes and greenhouse behavior.

---

# 24. Statistical-mechanical equilibrium templates

## Energy exchange
Two isolated subsystems:
\[
U_A+U_B=U_{\rm tot}
\]
\[
\Omega_{\rm tot}=\Omega_A(U_A)\Omega_B(U_B)
\]
At equilibrium:
\[
\frac{\partial S_A}{\partial U_A}
=
\frac{\partial S_B}{\partial U_B}
\]
\[
\boxed{T_A=T_B}
\]

## Volume exchange
\[
V_A+V_B=V_{\rm tot}
\]
At equilibrium:
\[
\boxed{p_A=p_B}
\]

## Particle exchange
\[
N_A+N_B=N_{\rm tot}
\]
At equilibrium:
\[
\boxed{\mu_A=\mu_B}
\]

## Canonical ensemble
System exchanges energy with heat bath; \(T,V,N\) fixed.

## Microcanonical ensemble
Isolated system; \(U,V,N\) fixed.

## Grand-canonical idea [advanced recognition]
Energy and particles exchanged; \(T,V,\mu\) fixed.

---

# 25. Ideal-gas entropy/process relations

## Reversible ideal-gas differential
\[
dS=\frac{C_V}{T}dT+\frac{Nk_B}{V}dV
\]

Equivalent:
\[
dS=\frac{C_p}{T}dT-\frac{Nk_B}{p}dp
\]

## Constant-temperature expansion
\[
\Delta S=Nk_B\ln(V_f/V_i)
\]

## Reversible adiabatic
\[
\Delta S=0
\]

## Constant-volume heating
\[
\Delta S=C_V\ln(T_f/T_i)
\]

## Constant-pressure heating
\[
\Delta S=C_p\ln(T_f/T_i)
\]

---

# 26. Useful \(pV\)-diagram recognition

## Horizontal line
\[
p=\mathrm{const}
\]
isobaric.

## Vertical line
\[
V=\mathrm{const}
\]
isochoric.

## Ideal-gas isotherm
\[
p\propto\frac1V
\]

## Reversible adiabat
\[
p\propto V^{-\gamma}
\]
Steeper than isotherm on a \(pV\) plot.

## Work
\[
W_{\rm by}=\text{signed area under curve}
\]

## Cycle
\[
W_{\rm net}=\text{signed enclosed area}
\]

---

# 27. Common conceptual oppositions

## Heat vs internal energy
\[
Q:\text{ transfer}
\qquad
U:\text{ state function}
\]

## Work vs internal energy
\[
W:\text{ transfer}
\qquad
U:\text{ state function}
\]

## Temperature vs heat
Temperature = state variable.  
Heat = energy transfer.

## Macrostate vs microstate
Macro = coarse bulk description.  
Micro = detailed microscopic state.

## Multiplicity vs probability
\[
\Omega=\text{number of compatible microstates}
\]
Probability depends on multiplicity and ensemble assumptions.

## Reversible vs quasistatic
Reversible implies stronger conditions; quasistatic alone does not rule out dissipation.

## Adiabatic vs isothermal
\[
Q=0
\quad\text{vs}\quad
T=\mathrm{const}
\]

## Isochoric vs adiabatic
\[
V=\mathrm{const}
\quad\text{vs}\quad
Q=0
\]

## Heat capacity \(C\) vs thermal conductivity \(\kappa\)
Storage response:
\[
C=dQ/dT
\]
Transport response:
\[
q=-\kappa\nabla T
\]

## \(C_V\) vs \(C_p\)
Different constraints; generally:
\[
C_p>C_V
\]
for ideal gases.

## \(k_B\) vs \(R\)
Per particle:
\[
k_B
\]
Per mole:
\[
R=N_Ak_B
\]

## \(H\) vs \(G\)
\[
H=U+pV
\]
\[
G=H-TS
\]

## \(F\) vs \(G\)
\[
F=U-TS
\]
natural fixed variables \(T,V,N\).

\[
G=U-TS+pV
\]
natural fixed variables \(T,p,N\).

---

# 28. Fast equation-trigger index

## "Ideal gas"
\[
pV=Nk_BT
\]

## "Mean molecular speed / RMS speed"
\[
v_{\rm rms}=\sqrt{3k_BT/m}
\]

## "Degrees of freedom"
\[
U=\frac{f}{2}Nk_BT
\]

## "Heat capacity"
\[
C=dQ/dT
\]

## "Constant volume"
\[
W=0,\qquad Q=\Delta U
\]

## "Constant pressure"
\[
W=p\Delta V,\qquad Q=\Delta H
\]

## "Isothermal ideal gas"
\[
\Delta U=0,\qquad
W=Nk_BT\ln(V_f/V_i)
\]

## "Reversible adiabatic ideal gas"
\[
pV^\gamma=\mathrm{const}
\]

## "Entropy / number of microstates"
\[
S=k_B\ln\Omega
\]

## "Entropy change from reversible heat"
\[
dS=\frac{dQ_{\rm rev}}T
\]

## "Two objects reach thermal equilibrium"
Energy conservation + entropy increase.

## "Probability of energy state"
\[
P_i\propto g_ie^{-E_i/k_BT}
\]

## "Normalize probabilities"
\[
Z=\sum_ig_ie^{-E_i/k_BT}
\]

## "Average energy"
\[
U=\sum_iP_iE_i
\]

## "Heat engine"
\[
W=Q_H-Q_C
\]
\[
\eta=W/Q_H
\]

## "Maximum efficiency"
\[
\eta_C=1-T_C/T_H
\]

## "Refrigerator"
\[
\mathrm{COP_R}=Q_C/W
\]

## "Heat pump"
\[
\mathrm{COP_{HP}}=Q_H/W
\]

## "Stable phase"
lowest \(\mu\) / minimum \(G\).

## "Phase coexistence"
\[
\mu_\alpha=\mu_\beta
\]

## "Latent heat"
\[
L=\Delta H=T\Delta S
\]

## "Phase-boundary slope"
\[
dp/dT=L/(T\Delta v)
\]

## "Semiconductor carrier fraction"
\[
\propto e^{-E_g/(2k_BT)}
\]

## "Quantum heat capacity / frozen mode"
\[
x=hf/k_BT
\]

## "Thermal radiation"
\[
P/A=\epsilon\sigma T^4
\]

## "Peak thermal wavelength"
\[
\lambda_{\max}T=b
\]

---

# 29. Legacy / older UIUC PHYS 213 practice-exam vocabulary

These appear in older UIUC PHYS 213 syllabi, formula sheets, lecture notes, or practice exams. Current Fall 2026 scheduling compresses or omits some of them explicitly, but old practice material may still use them.

## L Barometric / atmospheric Boltzmann distribution
Gravitational potential:
\[
E(z)=mgz
\]

Number density:
\[
\boxed{n(z)=n(0)e^{-mgz/(k_BT)}}
\]

Pressure for isothermal ideal atmosphere:
\[
\boxed{p(z)=p(0)e^{-mgz/(k_BT)}}
\]

Scale height:
\[
\boxed{H=\frac{k_BT}{mg}}
\]

Then:
\[
p(z)=p_0e^{-z/H}
\]

## L Diffusion
Random spreading caused by microscopic motion.

1D diffusion scale:
\[
\langle x^2\rangle=2Dt
\]

3D:
\[
\langle r^2\rangle=6Dt
\]

## L Random walk
After \(N\) independent equal steps of length \(\ell\):
\[
x_{\rm rms}\sim\ell\sqrt N
\]

## L Law of mass action / chemical equilibrium
For:
\[
aA+bB\rightleftharpoons cC+dD
\]

Chemical equilibrium:
\[
a\mu_A+b\mu_B=c\mu_C+d\mu_D
\]

Equivalent reaction condition:
\[
\sum_i\nu_i\mu_i=0
\]

Concentration/density ratios form equilibrium constant \(K(T)\).

## L Equilibrium constant
\[
K=K(T)
\]
Depends on temperature and reaction energetics, not on instantaneous concentrations.

## L Ideal-gas chemical potential
Characteristic structure:
\[
\mu=\mu^\circ(T)+k_BT\ln\frac{p}{p^\circ}
\]
or density form:
\[
\mu=\mu^\circ(T)+k_BT\ln\frac n{n^\circ}
\]

## L Quantum concentration / density — \(n_Q\)
Typical ideal-gas scale:
\[
\boxed{
n_Q=
\left(\frac{2\pi mk_BT}{h^2}\right)^{3/2}
}
\]

## L Ideal-gas chemical potential in course-style form
\[
\mu\sim k_BT\ln\left(\frac n{n_Q}\right)
\]
plus any binding/internal-energy offset.

## L Dilute classical condition
\[
n\ll n_Q
\]

## L Defect formation
Vacancy/interstitial/defect concentration often:
\[
\frac NM\propto e^{-\Delta/(ak_BT)}
\]
where \(a\) depends on how many coupled defects/objects are created.

## L Vacancy
Missing atom at a lattice site.

## L Interstitial
Atom occupying a non-lattice/interstitial site.

## L Frenkel pair
Vacancy + interstitial pair.

## L Surface adsorption
Particles bind to surface sites.

Fractional coverage:
\[
f=\frac{N_s}{M}
\]

Older course form:
\[
f=\frac{p}{p+p_0(T)}
\]
with
\[
p_0(T)\propto e^{-\Delta/(k_BT)}
\]
up to prefactors/convention.

## L Surface tension
Excess free energy per unit interface area:
\[
\gamma_{\rm surf}\sim\frac{\Delta G_{\rm surface}}A
\]

## L Nucleation
Formation of a new-phase cluster.

## L Critical nucleus
Cluster large enough that bulk free-energy gain exceeds surface free-energy cost.

## L Supercooling
Liquid remains metastable below equilibrium freezing temperature.

## L Superheating
Phase persists metastably above equilibrium transition temperature.

## L Freezing-point depression
Solute lowers solvent chemical potential in liquid, shifting phase coexistence temperature.

## L Boiling-point elevation
Nonvolatile solute lowers liquid solvent chemical potential, shifting boiling temperature upward.

## L Vapor-pressure lowering
Nonvolatile solute lowers solvent vapor pressure.

---

# 30. Symbols to recognize instantly

| Symbol | Meaning |
|---|---|
| \(T\) | temperature |
| \(U\) | internal energy |
| \(S\) | entropy |
| \(\Omega\) | multiplicity / number of equally probable states |
| \(C\) | heat capacity |
| \(C_V\) | heat capacity at constant volume |
| \(C_p\) | heat capacity at constant pressure |
| \(V\) | volume |
| \(p\) | pressure |
| \(\mu\) | chemical potential |
| \(N\) | number of particles |
| \(n\) | number of moles, depending on notation |
| \(N_A\) | Avogadro number |
| \(k_B\) | Boltzmann constant |
| \(R\) | molar gas constant |
| \(Q\) | heat transfer |
| \(W\) | work |
| \(H\) | enthalpy |
| \(F\) | Helmholtz free energy |
| \(G\) | Gibbs free energy |
| \(Z\) | partition function |
| \(g_i,d_i\) | degeneracy |
| \(\beta\) | \(1/(k_BT)\) |
| \(\gamma\) | \(C_p/C_V\) |
| \(\kappa\) | thermal conductivity |
| \(L\) | latent heat, context-dependent |
| \(\sigma_{\rm SB}\) | Stefan-Boltzmann constant |
| \(\epsilon\) | emissivity |
| \(h\) | Planck constant |
| \(f,\nu\) | frequency |
| \(\lambda\) | wavelength |
| \(\mu_e,\mu_p\) | electron/proton magnetic moment |
| \(E_g,\Delta\) | energy gap / activation gap |
| \(n_Q\) | quantum concentration |
| \(D\) | diffusion constant |
| \(\rho\) | density |
| \(v=V/N\) | volume per particle |
| \(s=S/N\) | entropy per particle |

---

# 31. One-line conceptual checkpoints

- \(Q\) and \(W\) are **not** state functions.
- \(U,S,H,F,G\) **are** state functions.
- \(k_BT\) is an energy scale, not universally "the energy of a particle."
- Equilibrium of isolated systems = maximum total entropy.
- Fixed \(T,V,N\) equilibrium = minimum \(F\).
- Fixed \(T,p,N\) equilibrium = minimum \(G\).
- Energy exchange equalizes \(T\).
- Volume exchange equalizes \(p\).
- Particle exchange equalizes \(\mu\).
- Expansion work by gas is positive under the PHYS 213 sign convention.
- For ideal gas, \(U\) depends only on \(T\).
- Reversible adiabatic ideal gas: \(pV^\gamma=\mathrm{const}\).
- Isothermal ideal gas: \(pV=\mathrm{const}\).
- \(S=k_B\ln\Omega\) assumes equally probable microstates.
- Boltzmann probability is per state; degeneracy multiplies level probability.
- High-energy states are suppressed by \(e^{-\Delta E/k_BT}\).
- Equipartition fails when level spacing is not small relative to \(k_BT\).
- A phase with lower \(\mu\) is favored at fixed \(T,p\).
- Phase coexistence requires equal chemical potentials.
- Latent heat changes phase without requiring temperature change.
- Carnot sets the reversible upper bound, not the efficiency of every engine.
- Thermal radiation scales as \(T^4\).
- Semiconductor carrier density is exponentially sensitive to \(1/T\).

---

# 32. Current Fall 2026 PHYS 213 lecture-topic checklist

Use this as the minimum coverage audit.

- [ ] ★ Internal energy
- [ ] ★ Temperature
- [ ] ★ Heat capacity
- [ ] ★ Entropy
- [ ] ★ Entropy II / exchange and equilibrium
- [ ] ★ Kinetic theory of the ideal gas
- [ ] ★ Quasistatic processes
- [ ] ★ Thermodynamic cycles
- [ ] ★ Gibbs free energy
- [ ] ★ Phases
- [ ] ★ Phase diagrams
- [ ] ★ Phase boundaries
- [ ] ★ Boltzmann factors
- [ ] ★ Heat capacity of a solid revisited / quantum oscillator heat capacity
- [ ] ★ Boltzmann factors and semiconductors
- [ ] ★ Greenhouse effects / thermal radiation
- [ ] ★ First Law
- [ ] ★ Second Law
- [ ] ★ Heat engines
- [ ] ★ Refrigerators / heat pumps
- [ ] ★ Chemical potential
- [ ] ★ Equipartition
- [ ] ★ Heat conduction
- [ ] ★ Microstates / macrostates / multiplicity
- [ ] ★ Combinatorics / probability
- [ ] ★ Enthalpy / latent heat
- [ ] ★ \(pV\) diagrams
- [ ] ★ Carnot bounds

---

# 33. Older-practice-material audit

If you use old UIUC PHYS 213 practice exams, also recognize:

- [ ] L Atmospheric/barometric Boltzmann factor
- [ ] L Magnetic spins / paramagnetism / Curie law
- [ ] L Helmholtz free energy
- [ ] L Chemical equilibrium
- [ ] L Law of mass action
- [ ] L Quantum concentration \(n_Q\)
- [ ] L Ideal-gas chemical potential
- [ ] L Defects / vacancies / interstitials
- [ ] L Electron-hole mass-action relation
- [ ] L Surface adsorption
- [ ] L Surface tension
- [ ] L Nucleation / critical nucleus
- [ ] L Vapor pressure
- [ ] L Clausius-Clapeyron relation
- [ ] L Freezing-point depression / boiling-point elevation
- [ ] L Diffusion / random walks
- [ ] L Blackbody radiation / Stefan-Boltzmann / Wien law

---

# 34. Formula clusters worth memorizing as families

## Entropy family
\[
S=k_B\ln\Omega
\]
\[
\frac1T=\left(\frac{\partial S}{\partial U}\right)_{V,N}
\]
\[
\frac pT=\left(\frac{\partial S}{\partial V}\right)_{U,N}
\]
\[
\frac{\mu}{T}=-\left(\frac{\partial S}{\partial N}\right)_{U,V}
\]
\[
dS=\frac1T\,dU+\frac pT\,dV-\frac\mu T\,dN
\]

## Ideal-gas/equipartition family
\[
pV=Nk_BT
\]
\[
\frac12m\langle v^2\rangle=\frac32k_BT
\]
\[
U=\frac f2Nk_BT
\]
\[
\gamma=1+\frac2f
\]

## Process family
\[
dU=dQ-p\,dV
\]
\[
W_{\rm by}=\int p\,dV
\]
\[
pV^\gamma=\mathrm{const}\quad(\text{rev. adiabatic})
\]
\[
pV=\mathrm{const}\quad(\text{ideal-gas isothermal})
\]

## Engine family
\[
W=Q_H-Q_C
\]
\[
\eta=\frac W{Q_H}
\]
\[
\eta_C=1-\frac{T_C}{T_H}
\]
\[
\mathrm{COP_R}=\frac{Q_C}{W}
\]
\[
\mathrm{COP_{HP}}=\frac{Q_H}{W}
\]

## Boltzmann family
\[
\beta=\frac1{k_BT}
\]
\[
f_i=e^{-\beta E_i}
\]
\[
Z=\sum_i g_ie^{-\beta E_i}
\]
\[
P_i=\frac{g_ie^{-\beta E_i}}Z
\]
\[
U=\sum_iP_iE_i
\]

## Free-energy family
\[
H=U+pV
\]
\[
F=U-TS
\]
\[
G=U-TS+pV
\]
\[
dG=-S\,dT+V\,dp+\mu\,dN
\]
\[
\mu=\left(\frac{\partial G}{\partial N}\right)_{T,p}
\]

## Phase family
\[
\mu_\alpha=\mu_\beta
\]
\[
L=\Delta H=T\Delta S
\]
\[
d\mu=v\,dp-s\,dT
\]
\[
\frac{dp}{dT}=\frac{L}{T\Delta v}
\]

## Quantum-solid family
\[
x=\frac{hf}{k_BT}
\]
\[
C_V=3Nk_B\frac{x^2e^x}{(e^x-1)^2}
\]
\[
\Omega=\binom{N+q-1}{q}
\]

## Semiconductor family
\[
n_i\propto e^{-E_g/(2k_BT)}
\]
\[
n_en_h=n_i^2
\]
\[
\sigma\propto n_{\rm carriers}
\]

## Radiation family
\[
E_\gamma=hf=\frac{hc}{\lambda}
\]
\[
j^\star=\epsilon\sigma_{\rm SB}T^4
\]
\[
\lambda_{\max}T=b
\]

---

# 35. Final recognition checklist

On sight, you should be able to identify what tool family is being invoked by each noun:

**internal energy · heat · work · state function · path dependence · temperature · thermal equilibrium · heat capacity · specific heat · thermal conductivity · entropy · multiplicity · microstate · macrostate · equilibrium · ideal gas · kinetic theory · RMS speed · equipartition · degree of freedom · frozen mode · quasistatic · reversible · irreversible · isothermal · isobaric · isochoric · adiabatic · isentropic · \(pV\) diagram · cycle · heat engine · Carnot engine · refrigerator · heat pump · efficiency · COP · enthalpy · Helmholtz free energy · Gibbs free energy · chemical potential · particle equilibrium · Boltzmann factor · partition function · degeneracy · two-level system · spin · paramagnetism · harmonic oscillator · Einstein solid · quantum heat capacity · semiconductor · band gap · electron · hole · phase · phase equilibrium · coexistence · phase boundary · phase diagram · triple point · critical point · latent heat · vapor pressure · melting · freezing · boiling · condensation · sublimation · thermal radiation · blackbody · emissivity · Stefan-Boltzmann law · Wien law · greenhouse effect · albedo.**
