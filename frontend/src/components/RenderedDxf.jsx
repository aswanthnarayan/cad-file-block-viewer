import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../apis/axios";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Vector3,
  Box3,
  Color,
  CircleGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DXFParser from "dxf-parser";
// import { useFile } from "@/context/fileContext";
// import DataTable from "./DataTable";

const RenderedDXF = ({ fileId }) => {
  const canvasRef = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const fetchLatestFile = async () => {
      try {
        const response = await axiosInstance.get(`/files/${fileId}`);
        if (response.data?.filePath) {
          const { filePath } = response.data;
          setFileUrl(`http://localhost:5000/files/${filePath}`);
        } else {
          console.error("No file path returned from the server");
        }
      } catch (error) {
        console.error("Failed to fetch latest file:", error);
      }
    };

    fetchLatestFile();
  }, [fileId]);

  useEffect(() => {
    if (!fileUrl || !canvasRef.current) return;

    const fetchAndRender = async () => {
      try {
        const response = await fetch(fileUrl);
        const dxfText = await response.text();

        const parser = new DXFParser();
        const dxfData = parser.parseSync(dxfText);

        renderDXF(dxfData);
      } catch (error) {
        console.error("Failed to load or parse DXF file:", error);
      }
    };

    fetchAndRender();
  }, [fileUrl]);

  const renderDXF = (dxfData) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );

    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    // Responsive canvas sizing
    // Get parent container's size
    const parent = canvasRef.current.parentElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (parent) {
      width = parent.clientWidth;
      height = parent.clientHeight;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new Color(0xffffff));
    scene.background = new Color(0xffffff);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const lines = [];

    dxfData.entities.forEach((entity) => {
      if (entity.type === "LINE") {
        const geometry = new BufferGeometry();
        const vertices = new Float32Array([
          entity.start.x, entity.start.y, 0,
          entity.end.x, entity.end.y, 0,
        ]);
        geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
        const material = new LineBasicMaterial({ color: 0x00ff00 });
        const line = new Line(geometry, material);
        scene.add(line);
        lines.push(line);
      }
      if (entity.type === "CIRCLE") {
        const geometry = new CircleGeometry(entity.radius, 32);
        geometry.rotateX(Math.PI / 2);  // Rotate to make it lie flat on the XY plane
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const circle = new Mesh(geometry, material);
        circle.position.set(entity.center.x, entity.center.y, 0);
        scene.add(circle);
      }
      if (entity.type === "LWPOLYLINE" || entity.type === "POLYLINE") {
        const geometry = new BufferGeometry();
        const points = [];
    
        for (let i = 0; i < entity.vertices.length - 1; i++) {
          const v1 = entity.vertices[i];
          const v2 = entity.vertices[i + 1];
          points.push(new Vector3(v1.x, v1.y, 0));
          points.push(new Vector3(v2.x, v2.y, 0));
        }
    
        // If it's a closed polyline, connect last to first
        if (entity.closed) {
          const vStart = entity.vertices[0];
          const vEnd = entity.vertices[entity.vertices.length - 1];
          points.push(new Vector3(vEnd.x, vEnd.y, 0));
          points.push(new Vector3(vStart.x, vStart.y, 0));
        }
    
        geometry.setFromPoints(points);
        const material = new LineBasicMaterial({ color: 0x0000ff });
        const line = new Line(geometry, material);
        scene.add(line);
        lines.push(line);
      }

      if (entity.type === "ARC") {
        const curve = new ArcCurve(entity.center.x, entity.center.y, entity.radius, entity.startAngle, entity.endAngle);
        const geometry = new BufferGeometry().setFromPoints(curve.getPoints(50));  // 50 is the number of points for the curve
        const material = new LineBasicMaterial({ color: 0x00ffff });
        const arc = new Line(geometry, material);
        scene.add(arc);
      }
    });

    if (lines.length === 0) {
      console.warn("No LINE entities found in the DXF.");
      return;
    }

    // Compute bounding box to center camera
    const boundingBox = new Box3();
    lines.forEach((line) => boundingBox.expandByObject(line));
    const center = new Vector3();
    boundingBox.getCenter(center);

    const size = new Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.5;

    camera.position.set(center.x, center.y, distance);
    camera.near = 0.1;
    camera.far = distance * 10;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  };

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default RenderedDXF;
