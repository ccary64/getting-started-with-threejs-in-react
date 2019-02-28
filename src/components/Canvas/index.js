import React, { Component } from 'react';
import * as THREE from 'three';
import ColladaLoader from '../../vendor/ColladaLoader';
import OrbitControls from 'three-orbitcontrols';

class Canvas extends Component {
  canvasRef = React.createRef();

  componentDidMount() {
    const canvas = this.canvasRef.current;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.init();
    this.renderAxes();
    this.renderGrid();
    this.renderRobot();
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  init = () => {
    window.addEventListener('resize', this.updateDimensions);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.camera.position.set(-2, 1, 2);
    this.controls.target = new THREE.Vector3(2, 0, 2);
    this.controls.update();
  }

  renderAxes = () => {
    const axes = new THREE.AxesHelper(1);
    axes.position.set(0, 0, 0);
    this.scene.add(axes);
  }

  renderGrid = () => {
    const gridHelper = new THREE.GridHelper(5, 5);
		gridHelper.position.y = -0.01;
    gridHelper.position.x = 1.5;
    gridHelper.position.z = 1.5;
		this.scene.add(gridHelper);
  }

  renderRobot = () => {
    const loader = new ColladaLoader();
    loader.load('/enemy-robot.dae', collada => {
      this.robot = collada.scene;
      this.robot.scale.set(0.01, 0.01, 0.01);
      this.robot.position.set(1, 0, 1);
      this.scene.add(this.robot)
    });
  }

  updateDimensions = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	  this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    const time = -performance.now() * 0.003;
    if (this.robot) {
      this.robot.rotation.y = Math.PI / 2 * time;
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default Canvas;